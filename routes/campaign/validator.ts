import { TCampaign } from "@/lib/types";
import { z } from "zod";

export const createCampaignDTO: z.ZodSchema<TCampaign> = z.object({
  name: z.string({ message: "Name of the campaign is required" }),
  type: z.enum(["Cost per Order", "Cost per Click", "Buy One Get One"], {
    message: "Type of the campaign is required",
  }),
  startDate: z.coerce.string(),
  endDate: z.coerce.string(),
});
