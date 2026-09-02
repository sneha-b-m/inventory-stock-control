import type { UserRole } from "@/app/generated/prisma/client";

export type CurrentUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};

// TODO: Implement session lookup.
// Eventually this should read the current session and
// return the authenticated user.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return null;
}

// TODO: Implement authentication enforcement.
// Eventually redirect unauthenticated users to /login.
export async function requireUser(): Promise<CurrentUser> {
  throw new Error("Authentication not implemented yet");
}

// TODO: Implement manager authorization.
// Eventually verify that the current user has MANAGER role.
export async function requireManager(): Promise<CurrentUser> {
  throw new Error("Manager authorization not implemented yet");
}