import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";


// avoid creating multiple db connections so using singleton pattern

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

const connection = postgres(process.env.DATABASE_URL, { prepare: false });
const db = globalThis._db || drizzle(connection);
if (process.env.NODE_ENV !== "production") {
  globalThis._db = db;
}

export default db;
