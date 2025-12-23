import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      NODE_ENV: z.enum(["development", "production", "test"]).optional(),
      ANALYZE: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_WEB_URL: z.url(),
      NEXT_PUBLIC_API_URL: z.url(),
    },
    runtimeEnv: {
      ANALYZE: process.env.ANALYZE,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
  });
