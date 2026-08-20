import postgres from 'postgres'

function databaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set.')
  }
  return url
}

export const sql = postgres(databaseUrl(), {
  ssl: 'require',
  max: 4,
  idle_timeout: 20,
  connect_timeout: 10,
})
