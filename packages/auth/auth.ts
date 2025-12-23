import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/database/client";
import * as schema from "@repo/database/schema";
import { env } from "./env";
import { organization } from "better-auth/plugins";
import { admin, member } from "./lib/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  plugins: [
    organization({
      roles: {
        admin,
        member,
      },
      allowUserToCreateOrganization: false,
    }),
  ],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
