import { TLiveCampaign } from "@/lib/types";
import { z } from "zod";

const liveCampaignPayload: z.ZodSchema<TLiveCampaign[]> = z.array(z.object({
  dayOfTheWeek: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  campaignId: z.string()
}))

export const campaignScheduleDTO = liveCampaignPayload;
