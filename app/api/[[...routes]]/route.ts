import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import {
  createCampaign,
  editCampaign,
  getAllCampaigns,
} from "../../../routes/campaign/route";
import { customLogger } from "@/lib/global";
import { createCampaignSchedule, updateCampaignSchedule, getAllCampaignSchedules } from "@/routes/campaignSchedule/route";
import RedisRateLimiter from "@/lib/global/ratelimit";


// Setting base endpoint of our api used for every api 
const app = new Hono().basePath("/api");
app.use(logger(customLogger));

app.notFound((ctx) =>
  ctx.json({ message: `${ctx.req.url} doesn't exist` }, 404)
);


// error handler to handle errors for botth dev and prod and you can psss custom logs to have verbos error handling
app.onError((err, ctx) => {
  const env = process.env.NODE_ENV;
  if (err instanceof HTTPException) return err.getResponse();

  customLogger(err.message);
  return ctx.json(
    {
      status: "failed",
      message: "Operation failed",
      ...(env === "development"
        ? {
            stack: err.stack,
            cause: err.cause,
            name: err.name,
            devLog: err.message,
          }
        : {}),
    },
    500
  );
});


// used ratelimit middleware as a singlton intsnace of the middleware class to have 1 instance in subsequest api hits
app.use(async (ctx, next) => {
  const ratelimiter = RedisRateLimiter.getInstance(ctx);
  ctx.set("ratelimit", ratelimiter);
  await next();
});


// all routes
const routes = app
  .route("/create-campaign", createCampaign)
  .route("/update-campaign", editCampaign)
  .route("/campaigns", getAllCampaigns)
  .route("/create-schedule", createCampaignSchedule)
  .route("/update-schedule", updateCampaignSchedule)
  .route("/all-schedules", getAllCampaignSchedules);


 // hanlders exposed by our backend 
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
