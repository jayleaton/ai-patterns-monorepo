import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const webAppRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const eslint = new ESLint({
  cwd: webAppRoot,
  overrideConfigFile: path.join(webAppRoot, 'eslint.config.mjs'),
})

async function lint(source, relativeFilePath) {
  const [result] = await eslint.lintText(source, {
    filePath: path.join(webAppRoot, relativeFilePath),
  })

  return result.messages
}

describe('ESLint architecture restrictions', () => {
  const restrictedDataImports = [
    "import { eq } from 'drizzle-orm'",
    "import { user } from '@better-stack-monorepo/database/src/schemas'",
    "import { db } from '@better-stack-monorepo/database/src/database'",
  ]
  const restrictedDataLayers = [
    'app/(routes)/api/core/v1/example/route.ts',
    'actions/example-action.ts',
    'lib/services/exampleService.ts',
  ]

  it.each(
    restrictedDataLayers.flatMap(filePath =>
      restrictedDataImports.map(source => [filePath, source])
    )
  )(
    'prevents %s from using a data implementation',
    async (filePath, source) => {
      const messages = await lint(source, filePath)

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: 'no-restricted-imports',
            severity: 2,
          }),
        ])
      )
    }
  )

  it.each([
    "import { createUserService } from '@/lib/services/userService'",
    "import { createUserRepository } from '@better-stack-monorepo/database/src/repositories/userRepository'",
    "import { auth } from '@/lib/auth/auth'",
    "import { Resend } from 'resend'",
  ])('keeps forbidden dependencies out of server actions', async source => {
    const messages = await lint(source, 'actions/example-action.ts')

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'no-restricted-imports',
          severity: 2,
        }),
      ])
    )
  })

  it('prevents client modules from importing server-only modules', async () => {
    const messages = await lint(
      "'use client'\nimport { secureFetch } from '@/lib/serverUtils'",
      'components/example-client.tsx'
    )

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'architecture/no-client-import-server-only',
          severity: 2,
        }),
      ])
    )
  })

  it('allows erased type imports from server-only modules', async () => {
    const messages = await lint(
      "'use client'\nimport type { ServiceContext } from '@/lib/types'",
      'components/example-client.tsx'
    )

    expect(messages).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'architecture/no-client-import-server-only',
        }),
      ])
    )
  })

  it('rejects core routes outside the canonical route tree', async () => {
    const messages = await lint(
      'export const GET = () => new Response()',
      'app/api/core/v1/example/route.ts'
    )

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'no-restricted-syntax',
          severity: 2,
        }),
      ])
    )
  })

  it('allows core routes in the canonical route tree', async () => {
    const messages = await lint(
      'export const GET = () => new Response()',
      'app/(routes)/api/core/v1/example/route.ts'
    )

    expect(messages).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: 'no-restricted-syntax' }),
      ])
    )
  })
})
