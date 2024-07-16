import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const sql = postgres(process.env.DATABASE_URL, {prepare: false});
const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: "./lib/db/migrations",
		});

		console.log("Migration successful");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();