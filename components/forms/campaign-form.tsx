"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { undefined, z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useModal } from "@/provider/modal-provider";
import {
  CampaignData,
  CampaignResponse,
  CampaignSchedules,
  SingleCampaign,
} from "@/lib/types";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { CalendarIcon, CirclePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { LoadingSpinner } from "../global/spinner";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useQueryClient } from "@tanstack/react-query";
import getApi from "@/store/apiStore";

type Props = {
  campaign?: Partial<
    CampaignData & { campSchedules?: CampaignSchedules["campaign"] }
  >;
};

// use to parse date and date manipulation
dayjs.extend(customParseFormat);

export const FormSchema = z.object({
  type: z.string({
    message: "Type of the campaign is required",
  }),

  dateRange: z
    .object(
      {
        from: z.date(),
        to: z.date(),
      },
      { required_error: "Date is required" }
    )
    .refine((date) => {
      return !!date.from;
    }, "Date is required."),

  name: z
    .string({ message: "Type of the campaign is required" })
    .min(6, { message: "Name should be bigger than 6 characters" })
    .max(250, { message: "Name should be lesser than 250 characters" }),

  schedules: z
    .array(
      z
        .object({
          dayOfTheWeek: z.string({
            message: "Day of the week is required",
          }),
          startTime: z.string().refine((time) => /^\d{2}:\d{2}$/.test(time), {
            message: "Invalid time format. Use HH:MM",
          }),
          endTime: z.string().refine((time) => /^\d{2}:\d{2}$/.test(time), {
            message: "Invalid time format. Use HH:MM",
          }),
        })
        .refine(
          (schedule) => {
            if (!schedule.startTime || !schedule.endTime) return true;
            const start = dayjs(schedule.startTime, "HH:mm");
            const end = dayjs(schedule.endTime, "HH:mm");
            return end.isAfter(start);
          },
          {
            message: "End time must be after start time",
            path: ["endTime"],
          }
        )
    )
    .refine(
      (schedules) => {
        const schedulesMap = new Map();
        for (const schedule of schedules) {
          const key = `${schedule.dayOfTheWeek}-${schedule.startTime}-${schedule.endTime}`;
          if (schedulesMap.has(key)) {
            return false;
          }
          schedulesMap.set(key, true);
        }
        return true;
      },
      {
        message: "Duplicate schedules are not allowed",
      }
    ),
});

export function CampaignForm({ campaign }: Props) {
  const queryClient = useQueryClient();
  const apiStore = getApi();
  const { data, setClose } = useModal();
  const [loader, setLoader] = useState(false);
  const [addSchedule, setAddSchedule] = useState<CampaignSchedules["campaign"]>(
    campaign?.campSchedules || []
  );
  const router = useRouter();

  const operation: "create" | "update" = !campaign ? "create" : "update";

  //   to handle form submissions and error states based on the schema defs and error handled when contet of the form is chnaged
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: campaign?.name,
      type: data.campaign?.type || campaign?.type,
      dateRange: {
        from: dayjs(campaign?.startDate).toDate(),
        to: dayjs(campaign?.endDate).toDate(),
      },
      schedules: addSchedule.map((schedule) => ({
        dayOfTheWeek: schedule.dayOfTheWeek,
        startTime: dayjs(schedule.startTime).format("HH:mm"),
        endTime: dayjs(schedule.endTime).format("HH:mm"),
      })),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoader(true);

      //  constructed api specific payload
      const payload = {
        name: data.name,
        type: data.type,
        startDate: dayjs(data.dateRange.from).format("YYYY-MM-DD"),
        endDate: dayjs(data.dateRange.to).format("YYYY-MM-DD"),
      };

      const response = await fetch(
        `${apiStore.campaign[operation].url}/${campaign?.id || ""}`,
        {
          method: apiStore.campaign[operation].method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const { data: newData } = (await response.json()) as CampaignResponse;

      //   if we have any schedule to create/update then triggered
      if (data.schedules.length) {
        const schedulePayload = data.schedules.map((s, i) => ({
          ...s,
          startTime:
            dayjs(data.dateRange.from).format("YYYY-MM-DD") +
            " " +
            s.startTime +
            ":00",
          endTime:
            dayjs(data.dateRange.to).format("YYYY-MM-DD") +
            " " +
            s.endTime +
            ":00",

          campaignId:
            campaign?.id || (newData.campaign as unknown as SingleCampaign).id,
          id: campaign?.campSchedules?.length
            ? campaign?.campSchedules[i]?.id
            : undefined,
        }));

        await fetch(
          `${apiStore.schedule[operation].url}/${campaign?.id || ""}`,
          {
            method: apiStore.schedule[operation].method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([...schedulePayload]),
          }
        );
      }

      if (response.status === 200) {
        toast({
          title: `Campaign ${operation}d`,
          description: `Campaign ${operation}d with id ${
            (newData.campaign as unknown as SingleCampaign).id || campaign?.id
          }`,

          duration: 2_000,
        });

        setClose();

        // invalidate the /capaign server component fetch
        router.refresh();

        // invalidate react query caches if updated / created to show new content not stale
        queryClient.invalidateQueries({ queryKey: ["all-schedules"] });
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });

        if (operation === "create")
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);

      toast({
        title: "Failure",
        variant: "destructive",
        description: `Failed to ${operation} campaign`,
        duration: 2_000,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter the name"
                  type="text"
                  className="w-full outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Type of campaign</FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full focus-visible:ring-0 outline-none">
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="Cost per Order">Cost per Order</SelectItem>
                  <SelectItem value="Cost per Click">Cost per Click</SelectItem>
                  <SelectItem value="Buy One Get One">
                    Buy One Get One
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Date range</FormLabel>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value.from}
                      selected={{ from: field.value.from!, to: field.value.to }}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {addSchedule.map((schedule, index) => {
          return (
            <div
              key={index}
              className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 w-full"
            >
              <FormField
                disabled={form.formState.isSubmitting}
                control={form.control}
                name={`schedules.${index}.dayOfTheWeek`}
                render={({ field }) => (
                  <FormItem className="w-full mb-2 md:w-1/2">
                    <FormLabel>Day to schedule</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full focus-visible:ring-0 outline-none">
                          <SelectValue placeholder="Select days..." />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-center items-center">
                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name={`schedules.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Start time</FormLabel>
                      <div className="w-[150px]">
                        <Input
                          {...field}
                          placeholder="HH:MM"
                          type="time"
                          className="w-full outline-none"
                          value={
                            dayjs(field.value).isValid()
                              ? dayjs(field.value).format("HH:mm")
                              : field.value
                          }
                        />
                      </div>
                      <FormMessage className="w-[120px] text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name={`schedules.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>End time</FormLabel>
                      <div className="w-[150px]">
                        <Input
                          {...field}
                          placeholder="HH:MM"
                          type="time"
                          className="w-full outline-none"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={
                            dayjs(field.value).isValid()
                              ? dayjs(field.value).format("HH:mm")
                              : field.value
                          }
                        />
                      </div>
                      <FormMessage className="w-[120px] text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}

        {form.formState.errors.schedules &&
          !Array.isArray(form.formState.errors.schedules) && (
            <p className="text-sm font-medium text-destructive mt-2 mb-4 text-center">
              {(form.formState.errors.schedules as any).root.message}
            </p>
          )}

        <Button
          disabled={form.formState.isSubmitting}
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => {
            const newSchedule = {
              dayOfTheWeek: "Monday",
              startTime: "",
              endTime: "",
              campaignId: campaign?.id!,
              id: "",
            };
            setAddSchedule([...addSchedule, newSchedule]);
            form.setValue("schedules", [
              ...form.getValues("schedules"),
              {
                dayOfTheWeek: "Monday",
                startTime: "",
                endTime: "",
              },
            ]);
          }}
        >
          Add Schedule <CirclePlus className="ml-2" width={20} height={20} />
        </Button>

        <Button
          type="submit"
          className="mt-8 w-full"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {loader ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
