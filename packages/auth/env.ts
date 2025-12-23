import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  schema: {
    private: {
      BETTER_AUTH_SECRET: v.pipe(
        v.string("BETTER_AUTH_SECRET is required"),
        v.minLength(16, "Must be atleast 32 characters"),
      ),
      BETTER_AUTH_URL: v.pipe(
        v.string("BETTER_AUTH_URL is required"),
        v.url("Must be a valid URL"),
      ),
    },
    shared: {
      NODE_ENV: v.optional(
        v.picklist(["development", "production", "test"]),
        "development",
      ),
    },
    public: {
      NEXT_PUBLIC_AUTH_URL: v.pipe(
        v.string("NEXT_PUBLIC_AUTH_URL is required"),
        v.url("Must be valid url"),
      ),
    },
  },
  values: process.env,
});
