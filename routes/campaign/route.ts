import db from "@/lib/db";
import { campaigns, liveCampaigns } from "@/lib/db/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCampaignDTO } from "./validator";
import { desc, eq, count } from "drizzle-orm";
import { TCampaign } from "@/lib/types";
import { paginationValidator } from "@/lib/global";


const createCampaignValidator = zValidator("json", createCampaignDTO);

export const createCampaign = new Hono().post(
  createCampaignValidator,
  async (ctx) => {
    const body = ctx.req.valid("json");
    const result = await db.insert(campaigns).values(body).returning();

    return ctx.json(
      {
        status: "success",
        message: "Campaign added",
        data: {
          campaign: result[0],
        },
      },
      200
    );
  }
);

export const getAllCampaigns = new Hono().get(
  "/",
  paginationValidator,
  async (ctx) => {
    const ratelimit = ctx.get("ratelimit");
    const {success} = await ratelimit.limit("api");

    if (success) {
      const { page, count: c } = ctx.req.valid("query");
      const skip = (+page - 1) * +c;
      const result = await db
        .select()
        .from(campaigns)
        .orderBy(desc(campaigns.created_at))
        .offset(skip)
        .limit(+c);

      const schedulesForCampaign = await Promise.all(
        result.map(({ id }) =>
          db
            .select({ count: count() })
            .from(liveCampaigns)
            .where(eq(liveCampaigns.campaignId, id))
        )
      );

      const resultantSchedules = schedulesForCampaign.flatMap((a) => a);
      const finalData = result.map((data, idx) => ({
        schedules: resultantSchedules[idx].count,
        ...data,
      }));


      return ctx.json(
        {
          status: "success",
          message: "Campaigns fetched",
          data: {
            campaign: finalData,
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
  }
);

export const editCampaign = new Hono().patch("/:id", async (ctx) => {
  const { name, type, startDate, endDate } =
    (await ctx.req.json()) as Partial<TCampaign>;
  const { id } = ctx.req.param();

  if (!id) throw new Error("'id' must be provided");

  const result = await db
    .update(campaigns)
    .set({ name, type, updated_at: new Date(), startDate, endDate })
    .where(eq(campaigns.id, id))
    .returning();

  return ctx.json(
    {
      status: "success",
      message: `Campaign with id ${id} has been updated`,
      data: {
        campaign: result,
      },
    },
    200
  );
});
