import React from "react";
import CampaignList from "./_components/CampaignList";
import { getHostDetails } from "@/lib/global/getHostDetails";
import { CampaignResponse } from "@/lib/types";
import MaxLimitReached from "@/components/global/max-limit";

const page = async () => {
  const { url } = getHostDetails();

  const allCampaigns = await fetch(`${url}/api/campaigns?page=1&count=10`, {
    method: "GET",
    cache: "default",
  });

  const response = (await allCampaigns.json()) as CampaignResponse;
  if (response.status === "failed") return <MaxLimitReached />;

  return (
    <>
      <CampaignList initialData={response.data.campaign} />
    </>
  );
};

export default page;