// @feature:database-connection @domain:database @backend
// @summary: Server-only database connection and configuration

import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Get database URL from environment
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  return url
}

// TLS is controlled by the connection string itself: hosted Postgres URLs
// carry `?sslmode=require`, local Docker stays plain. Never infer TLS from
// NODE_ENV — that breaks production builds against local databases.
const sql = postgres(getDatabaseUrl())

// Connect to Postgres (server-only)
export const db = drizzle(sql)

export type DB = typeof db