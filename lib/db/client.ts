import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Singleton database client to prevent multiple connections
let cachedClient: ReturnType<typeof postgres> | null = null;
let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDbClient() {
  if (!cachedClient) {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }
    cachedClient = postgres(process.env.POSTGRES_URL);
  }
  return cachedClient;
}

export function getDb() {
  if (!cachedDb) {
    cachedDb = drizzle(getDbClient());
  }
  return cachedDb;
}
