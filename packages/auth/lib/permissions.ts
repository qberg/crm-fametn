import { createAccessControl } from "better-auth/plugins";

export const statement = {
  member: ["read", "update"],
  organization: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  member: ["read", "update"],
  organization: ["read", "update"],
});

export const member = ac.newRole({
  member: ["read"],
  organization: ["read"],
});
