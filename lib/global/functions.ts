"use client";

import { CampaignSchedules } from "../types";

export const getCampaignScheduleDetails = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [, cid] = queryKey;

  const response = await fetch(`/api/all-schedules/${cid}`, {
    method: "GET",
  });

  return (await response.json()) as { data: CampaignSchedules };
};
