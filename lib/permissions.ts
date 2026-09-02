import type { UserRole } from "@/app/generated/prisma/client";

// Role helpers

export function isManager(role: UserRole): boolean {
  return role === "MANAGER";
}

export function isStaff(role: UserRole): boolean {
  return role === "STAFF";
}

// Permission helpers

export function canManageUsers(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageLocations(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageCategories(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageItems(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageAssignments(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canRecordStockMovements(role: UserRole): boolean {
  return role === "MANAGER" || role === "STAFF";
}

export function canDismissLowStockAlerts(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canViewAllLocations(role: UserRole): boolean {
  return role === "MANAGER";
}

// TODO: Add location-specific permission checks.
// STAFF users should only access locations assigned to them.