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

const app = new Hono().basePath("/api");
app.use(logger(customLogger));

app.notFound((ctx) =>
  ctx.json({ message: `${ctx.req.url} doesn't exist` }, 404)
);

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

const routes = app
  .route("/create-campaign", createCampaign)
  .route("/update-campaign", editCampaign)
  .route("/campaigns", getAllCampaigns);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
