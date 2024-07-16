import { campaigns } from "../db/schema";

export type TCampaign = typeof campaigns.$inferInsert;
