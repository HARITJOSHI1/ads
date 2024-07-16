import { campaigns, liveCampaigns } from "../db/schema";

export type TCampaign = typeof campaigns.$inferInsert;

export type TLiveCampaign = typeof liveCampaigns.$inferInsert;

export type CampaignResponse = {
    status: string;
    message: string;
    data: {
      campaign: {
        id: string;
        name: string;
        type: "Cost per Order" | "Cost per Click" | "Buy One Get One";
        created_at: string;
        updated_at: string;
        startDate: string;
        endDate: string;
        isLive: boolean | null;
        schedules: number
      }[];
    };
  };
  
  export type SingleCampaign = {
    id: string;
    name: string;
    type: "Cost per Order" | "Cost per Click" | "Buy One Get One";
    created_at: string;
    updated_at: string;
    startDate: string;
    endDate: string;
    isLive: boolean | null;
  };
  
  export type CampaignData = {
    id: string;
    name: string;
    type: "Cost per Order" | "Cost per Click" | "Buy One Get One";
    created_at: string;
    updated_at: string;
    startDate: string;
    endDate: string;
    isLive: boolean | null;
    schedules: number;
  };
  
  export type CampaignSchedules = {
    campaign: {
      id: string;
      dayOfTheWeek: string;
      startTime: string;
      endTime: string;
      campaignId: string | null;
    }[];
  };
  