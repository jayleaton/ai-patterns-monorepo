import { defineConfig, globalIgnores } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'

export default defineConfig([
  ...expoConfig,
  globalIgnores(['.expo/**', 'dist/**', 'web-build/**', 'expo-env.d.ts']),
])
