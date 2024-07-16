import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const paginationDTO = z.object({
  page: z.coerce.number({ message: "page is required" }),
  count: z.coerce.number().min(2).max(100),
});

export const paginationValidator = zValidator("query", paginationDTO);

export const customLogger = (message: string, ...rest: string[]) => {
  const env = process.env.NODE_ENV;
  const logMsg = env + ": " + message;

  console.log(logMsg, ...rest);
};
