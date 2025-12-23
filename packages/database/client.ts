import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
import * as schema from "./schema";

const MAX_CONNECTIONS_DEV = 5;
const MAX_CONNECTIONS_PROD = 10;

/**
 * Global database client instance
 * In dev, prevents hot reload from creating new connections
 */
let clientInstance: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase() {
  if (dbInstance && clientInstance) {
    return { db: dbInstance, client: clientInstance };
  }

  clientInstance = postgres(env.DATABASE_URL, {
    max:
      env.NODE_ENV === "production"
        ? MAX_CONNECTIONS_PROD
        : MAX_CONNECTIONS_DEV,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
    prepare: false,
  });

  dbInstance = drizzle(clientInstance, {
    schema,
    logger: env.NODE_ENV === "development",
  });

  return { db: dbInstance, client: clientInstance };
}

export async function closeDatabase() {
  if (clientInstance) {
    await clientInstance.end({ timeout: 5 });
    clientInstance = null;
    dbInstance = null;
  }
}

export const { db, client } = getDatabase();

export type Database = typeof db;
