import { z, TypeOf } from "zod";

// ts def for env's
const zodEnv = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  REDIS_TOKEN: z.string()
});


// to make env type defs globally available by using process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}


// if env not present in .env then send a custom error
try {
  zodEnv.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field
      )
      .join("\n  ");
    throw new Error(`Missing environment variables:\n  ${errorMessage}`);
  }
}
