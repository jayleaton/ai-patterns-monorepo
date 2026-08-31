import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webAppRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const repositoryRoot = path.resolve(webAppRoot, '../..')
const sourceExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mts',
  '.cts',
  '.mjs',
  '.cjs',
]
const serverOnlyMarker = /^\s*import\s+['"]server-only['"]\s*;?/m

function resolveSourceFile(candidate) {
  const candidates = [candidate]

  if (!sourceExtensions.includes(path.extname(candidate))) {
    candidates.push(
      ...sourceExtensions.map(extension => `${candidate}${extension}`)
    )
    candidates.push(
      ...sourceExtensions.map(extension =>
        path.join(candidate, `index${extension}`)
      )
    )
  }

  return candidates.find(filePath => {
    try {
      return fs.statSync(filePath).isFile()
    } catch {
      return false
    }
  })
}

function resolveImportSource(importSource, importerPath) {
  if (importSource.startsWith('@/')) {
    return resolveSourceFile(path.join(webAppRoot, importSource.slice(2)))
  }

  if (importSource.startsWith('@better-stack-monorepo/')) {
    const [workspace, ...subpath] = importSource
      .slice('@better-stack-monorepo/'.length)
      .split('/')

    return resolveSourceFile(
      path.join(repositoryRoot, 'packages', workspace, ...subpath)
    )
  }

  if (importSource.startsWith('.')) {
    return resolveSourceFile(
      path.resolve(path.dirname(importerPath), importSource)
    )
  }
}

function isTypeOnlyImport(node) {
  if (node.importKind === 'type' || node.exportKind === 'type') {
    return true
  }

  return (
    node.type === 'ImportDeclaration' &&
    node.specifiers.length > 0 &&
    node.specifiers.every(specifier => specifier.importKind === 'type')
  )
}

const noClientImportServerOnly = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Prevent modules marked with 'use client' from importing modules marked with 'server-only'",
    },
    schema: [],
    messages: {
      serverOnlyImport:
        "Client modules cannot import server-only module '{{importSource}}'. Move the dependency behind a server action or pass serializable data into the client module.",
    },
  },
  create(context) {
    let isClientModule = false

    function checkImport(node) {
      if (!isClientModule || isTypeOnlyImport(node) || !node.source) {
        return
      }

      const importSource = node.source.value
      if (typeof importSource !== 'string') {
        return
      }

      const importerPath = context.getPhysicalFilename()
      const importedFile = resolveImportSource(importSource, importerPath)
      const importsServerOnly =
        importSource === 'server-only' ||
        (importedFile &&
          serverOnlyMarker.test(fs.readFileSync(importedFile, 'utf8')))

      if (importsServerOnly) {
        context.report({
          node: node.source,
          messageId: 'serverOnlyImport',
          data: { importSource },
        })
      }
    }

    return {
      Program(node) {
        isClientModule = node.body.some(
          statement => statement.directive === 'use client'
        )
      },
      ImportDeclaration: checkImport,
      ExportNamedDeclaration: checkImport,
      ExportAllDeclaration: checkImport,
      ImportExpression: checkImport,
    }
  },
}

const architecturePlugin = {
  meta: {
    name: 'better-stack-architecture',
    version: '1.0.0',
  },
  rules: {
    'no-client-import-server-only': noClientImportServerOnly,
  },
}

export default architecturePlugin
