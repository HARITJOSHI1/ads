"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import clsx from "clsx";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useModal } from "@/provider/modal-provider";
import CustomModal from "@/components/modal";
import { useQuery } from "@tanstack/react-query";
import { getCampaignScheduleDetails } from "@/lib/global/functions";
import { CampaignForm } from "@/components/forms/campaign-form";

type Props = {
  name: string;
  type: string;
  isLive: boolean;
  schedules: number;
  startDate: string;
  endDate: string;
  id: string;
};

const CampaignCard = ({
  name,
  type,
  isLive,
  schedules,
  startDate,
  endDate,
  id,
}: Props) => {
  const radius = 150;
  const [visible, setVisible] = useState(false);
  const { setOpen } = useModal();
  const { isLoading, isSuccess, error, data } = useQuery({
    queryKey: ["all-schedules", id!],
    queryFn: getCampaignScheduleDetails,
  });

  const start = dayjs(startDate).format("MMMM DD, YYYY");
  const end = dayjs(endDate).format("MMMM DD, YYYY");
  const next = dayjs(endDate).add(1, "day").format("MMMM DD, YYYY");

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLElement>) => {
    if (currentTarget instanceof HTMLElement) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
  };

  const handleUpdate = async () => {
    if (isLoading || !data || !isSuccess) return;
    setOpen(
      <CustomModal
        title="Update Campaign details"
        subheading="Customize however you like!"
      >
        <CampaignForm
          campaign={{
            id,
            name,
            //@ts-ignore
            type,
            startDate,
            endDate,
            campSchedules: !error ? data?.data?.campaign : undefined,
          }}
        />
      </CustomModal>
    );
  };

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
radial-gradient(
  ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
  var(--blue-500),
  transparent 80%
)
`,
        cursor: "pointer",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="w-[80%] mb-4 p-[2px] md:mr-4 rounded-lg transition duration-300 group/input md:w-1/3"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col md:flex md:flex-row md:justify-between">
            <span className="flex flex-col">
              <span>{type}</span>
              <span className="text-sm mt-2">{name}</span>
            </span>
            <Badge
              variant="default"
              className={clsx(
                "text-sm font-normal mt-2 w-fit md:mt-0 md:h-fit",
                {
                  "bg-green-500 hover:bg-green-700": isLive,
                }
              )}
            >
              {isLive ? "active" : "inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <span>Start Date:</span>
              <span>{start}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>End Date:</span>
              <span>{end}</span>
            </div>

            <div>Total schedules: {schedules}</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <span>Next activation: {next}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="default" onClick={handleUpdate}>
            {" "}
            Update{" "}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CampaignCard;
