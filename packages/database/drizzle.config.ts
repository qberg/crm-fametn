import type { Config } from "drizzle-kit";
import { env } from "./env";

export default {
  out: "./drizzle",
  schema: "./schema",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  casing: "snake_case",
} satisfies Config;
