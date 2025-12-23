import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  schema: {
    private: {
      DATABASE_URL: v.pipe(
        v.string("Database URL is required"),
        v.url("Must be a valid URL"),
        v.startsWith(
          "postgresql://",
          "Must be a PostgresSQL connection string",
        ),
      ),
    },
    shared: {
      NODE_ENV: v.optional(
        v.picklist(["development", "production", "test"]),
        "development",
      ),
    },
  },
  values: process.env,
});
