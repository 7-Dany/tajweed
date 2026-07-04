/**
 * Applies SQL migrations from supabase/migrations/ to the Supabase database,
 * then seeds data from courses.json.
 *
 * Usage: bun run scripts/migrate.ts
 */

import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { Pool } from "pg"

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations")

async function main() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_NON_POOLING!,
    ssl: { rejectUnauthorized: false },
  })

  // 1. Run migrations
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()

  for (const file of files) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8")
    console.log(`Running ${file}...`)
    await pool.query(sql)
    console.log(`  ✓ ${file}`)
  }

  await pool.end()
  console.log("\n✅ Migrations applied. Now run the seed:")
  console.log("   bun run scripts/seed-supabase.ts")
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
