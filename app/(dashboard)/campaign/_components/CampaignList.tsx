"use client";

import { CampaignData, CampaignResponse } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useModal } from "@/provider/modal-provider";

import CustomModal from "@/components/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  initialData: CampaignData[];
};

const CampaignList = ({ initialData }: Props) => {
  const { setOpen } = useModal();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<
    CampaignData[],
    Error
  >({
    queryKey: ["campaigns", 1],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Page to fetch", pageParam);

      const response = await fetch(`/api/campaigns?page=${pageParam}&count=10`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return ((await response.json()) as CampaignResponse).data.campaign;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length + 1;
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (pages.length <= 1) return undefined;
      return pages.length - 1;
    },
    initialData: { pages: [initialData], pageParams: [currentPage] },
    initialPageParam: 1,
  });

  useEffect(() => {
    // Ensure currentPage is always within bounds
    if (data) {
      setCurrentPage(Math.min(Math.max(1, currentPage), data.pages.length));
    }
  }, [data, currentPage]);

  const allCampaigns = data?.pages[currentPage - 1] ?? [];


  const handleCreateNewCampaign = () => {
    setOpen(
      <CustomModal title="Create Campaign" subheading="Enter details!">
        {/* todo: add campaign form */}
      </CustomModal>
    );
  };

  console.log("Current page", currentPage);

  const handleNextPage = async () => {
    if (currentPage < (data?.pages.length ?? 0)) {
      // If we already have the next page, just update the current page
      setCurrentPage((prev) => prev + 1);
    } else if (hasNextPage) {
      // If we need to fetch the next page
      await fetchNextPage();
      setCurrentPage((prev) => prev + 1);
    }
  };


  // prev pages will already in cache only change current page
  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div
        className={`min-h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center`}
      >
        <div className="relative pointer-events-none inset-0 dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <section className="flex flex-col justify-center w-full md:flex md:flex-row md:flex-wrap items-center md:justify-center md:pl-8 md:pr-8 absolute top-32 left-0 ">
          {allCampaigns.map(
            ({ name, type, isLive, schedules, startDate, endDate, id }) =>
              // todo: add campaign card component
              null
          )}

          <Pagination className="mb-4 mt-4">
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious onClick={handlePrevPage} />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>

              <PaginationItem className="cursor-pointer">
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Card
            onClick={() => handleCreateNewCampaign()}
            className="w-[80%] mb-4 p-[2px] md:mr-4 rounded-lg transition duration-300 group/input md:w-1/3 bg-opacity-20 backdrop-filter backdrop-blur-lg hover:bg-opacity-30 cursor-pointer flex items-center justify-center bg-slate-100"
          >
            <div className="text-4xl text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <PlusIcon size={48} />
            </div>
          </Card>
        </section>
      </div>
    </>
  );
};

export default CampaignList;
