import { beforeEach, vi } from 'vitest'

// Mock server-only module for tests
vi.mock('server-only', () => ({}))

// Mock the database connection
vi.mock('@better-stack-monorepo/database/src/database', () => ({
  db: vi.fn(),
}))

// Mock the repository functions
vi.mock('@better-stack-monorepo/database/src/repositories/userRepository', () => ({
  createUserRepository: vi.fn(),
}))

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// Mock crypto for Node.js test environment
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${Math.random().toString(36).slice(2, 11)}`,
  },
})

beforeEach(() => {
  // Reset any global state before each test
  vi.clearAllMocks()
})
