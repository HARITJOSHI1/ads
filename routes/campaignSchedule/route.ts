import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { campaignScheduleDTO } from "./validator";
import { liveCampaigns } from "@/lib/db/schema";
import db from "@/lib/db";
import { TLiveCampaign } from "@/lib/types";
import { eq } from "drizzle-orm";
import { paginationValidator } from "@/lib/global";
import dayjs from "dayjs";

const scheduleCampaignValidator = zValidator("json", campaignScheduleDTO);

export const createCampaignSchedule = new Hono().post(
  scheduleCampaignValidator,
  async (ctx) => {
    const body = ctx.req.valid("json");
    const result = await db.insert(liveCampaigns).values(body).returning();

    return ctx.json(
      {
        status: "success",
        message: `${result.length} live instances scheduled for this campaign`,
        data: result.length,
      },
      200
    );
  }
);

export const updateCampaignSchedule = new Hono().patch("/:id", async (ctx) => {
  const { id } = ctx.req.param();
  if (!id) throw new Error("'id' must be provided");

  const body = (await ctx.req.json()) as Partial<TLiveCampaign>[];

  const result = await Promise.all(
    body.map(async (b) => {
      if (b.startTime) b.startTime = dayjs(b.startTime).toDate();
      if (b.endTime) b.endTime = dayjs(b.endTime).toDate();

      return await db
        .insert(liveCampaigns)
        .values(b as Required<TLiveCampaign>)
        .onConflictDoUpdate({ target: liveCampaigns.id, set: b });
    })
  );

  return ctx.json(
    {
      status: "success",
      message: "Campaign updated to new schedule",
      data: result,
    },
    200
  );
});

export const getAllCampaignSchedules = new Hono().get("/:id", async (ctx) => {
  // const ratelimit = ctx.get("ratelimit");
  // const { success } = await ratelimit.limit("api");
  const success = true;
  if (success) {
    const { id } = ctx.req.param();

    console.log("Id", id);

    const result = await db
      .select()
      .from(liveCampaigns)
      .where(eq(liveCampaigns.campaignId, id));

    return ctx.json(
      {
        status: "success",
        message: `all schedules for campaign with id ${result[0].campaignId}`,
        data: {
          campaign: result,
        },
      },
      200
    );
  }

  return ctx.json(
    {
      status: "failed",
      message: "You are blocked to make any further request",
    },
    429
  );
});
