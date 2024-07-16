DO $$ BEGIN
 CREATE TYPE "public"."campaign_types" AS ENUM('Cost per Order', 'Cost per Click', 'Buy One Get One');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL,
	"campaign_types" "campaign_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"start_date" date DEFAULT now() NOT NULL,
	"end_date" date DEFAULT now() NOT NULL,
	"live" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liveCampaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_of_the_week" varchar(30) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"campaign_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liveCampaigns" ADD CONSTRAINT "liveCampaigns_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
