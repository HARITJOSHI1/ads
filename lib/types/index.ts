import { campaigns, liveCampaigns } from "../db/schema";

export type TCampaign = typeof campaigns.$inferInsert;

export type TLiveCampaign = typeof liveCampaigns.$inferInsert;