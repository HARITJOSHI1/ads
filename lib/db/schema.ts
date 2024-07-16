import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  pgEnum,
  date,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const campaignTypes = pgEnum("campaign_types", [
  "Cost per Order",
  "Cost per Click",
  "Buy One Get One",
]);

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  type: campaignTypes("campaign_types").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  startDate: date("start_date").notNull().defaultNow(),
  endDate: date("end_date").notNull().defaultNow(),
  isLive: boolean("live").default(false),
});

export const liveCampaigns = pgTable("liveCampaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  dayOfTheWeek: varchar("day_of_the_week", { length: 30 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, {
    onDelete: "cascade",
  }),
});

export const campaignRelation = relations(campaigns, ({ many }) => ({
  campaign: many(liveCampaigns),
}));

export const liveCampaignRelation = relations(liveCampaigns, ({ one }) => ({
  liveCampaign: one(campaigns, {
    fields: [liveCampaigns.campaignId],
    references: [campaigns.id],
  }),
}));
