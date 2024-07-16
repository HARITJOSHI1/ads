import "server-only";
import { headers } from "next/headers";

export const getHostDetails = () => {
  const host = headers().get("host");
  const protocal = process?.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${protocal}://${host}`;

  return { host, protocal, url };
};
