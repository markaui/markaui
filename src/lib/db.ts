import { PrismaClient } from '@prisma/client'

/**
 * Serverless hosts (Vercel) provide no persistent DATABASE_URL and only /tmp is
 * writable. Local dev always has .env DATABASE_URL → this branch never runs
 * there and behaviour is unchanged.
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/tmp/markaui.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const client =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })

/**
 * Idempotent schema bootstrap for ephemeral environments: generated Prisma DDL
 * with IF NOT EXISTS guards. Runs once per process, before the first model
 * query, via a $extends query hook (Prisma 6 removed $use middleware).
 */
const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "city" TEXT,
    "profession" TEXT,
    "height" TEXT,
    "about" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Interest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "note" TEXT,
    "owner" TEXT NOT NULL DEFAULT 'guest',
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "MembershipOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "owner" TEXT NOT NULL DEFAULT 'guest',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "ConciergeMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "ProfileCuration" (
    "profileId" TEXT NOT NULL PRIMARY KEY,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "SavedSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "queryJson" TEXT NOT NULL,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    "lastCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "refId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Member_email_key" ON "Member"("email");
CREATE INDEX IF NOT EXISTS "Member_email_idx" ON "Member"("email");
CREATE INDEX IF NOT EXISTS "Interest_owner_createdAt_idx" ON "Interest"("owner", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Interest_profileId_owner_key" ON "Interest"("profileId", "owner");
CREATE INDEX IF NOT EXISTS "MembershipOrder_createdAt_idx" ON "MembershipOrder"("createdAt");
CREATE INDEX IF NOT EXISTS "MembershipOrder_owner_createdAt_idx" ON "MembershipOrder"("owner", "createdAt");
CREATE INDEX IF NOT EXISTS "ConciergeMessage_session_createdAt_idx" ON "ConciergeMessage"("session", "createdAt");
CREATE INDEX IF NOT EXISTS "SavedSearch_owner_createdAt_idx" ON "SavedSearch"("owner", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "SavedSearch_owner_name_key" ON "SavedSearch"("owner", "name");
CREATE INDEX IF NOT EXISTS "Notification_owner_createdAt_idx" ON "Notification"("owner", "createdAt");
CREATE INDEX IF NOT EXISTS "Notification_refId_idx" ON "Notification"("refId");
`.trim()

let schemaReady: Promise<void> | null = null

async function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    for (const statement of SCHEMA_DDL.split(';')) {
      const sql = statement.trim()
      if (sql) await client.$executeRawUnsafe(sql)
    }
  })().catch((err) => {
    schemaReady = null // allow retry on the next query
    throw err
  })
  await schemaReady
}

/**
 * Wrap every model operation with the schema bootstrap so API routes work on
 * fresh serverless instances with an empty database.
 */
export const db = client.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        await ensureSchema()
        return query(args)
      },
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
