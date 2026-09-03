"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

/*
 * TODO: Session 3
 * Authentication is not implemented yet.
 * Replace the demo manager lookup below with requireManager()
 * when authentication and authorization are added.
 */
async function getDemoManager() {
  const manager = await prisma.user.findUnique({
  where: {
    email: "manager@example.com",
  },
});

  if (!manager) {
    throw new Error("Demo Manager user not found.");
  }

  return manager;
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Category name is required.");
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new Error("A category with this name already exists.");
  }

  await prisma.category.create({
    data: {
      name,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });

  revalidatePath("/categories");

  redirect("/categories");
}

export async function createLocation(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  if (!name) {
    throw new Error("Location name is required.");
  }

  if (!code) {
    throw new Error("Location code is required.");
  }

  const existingLocation = await prisma.location.findFirst({
    where: {
      OR: [{ name }, { code }],
    },
  });

  if (existingLocation) {
    throw new Error("A location with this name or code already exists.");
  }

  await prisma.location.create({
    data: {
      name,
      code,
      address: String(formData.get("address") ?? "").trim() || null,
    },
  });

  revalidatePath("/locations");

  redirect("/locations");
}

export async function createItem(formData: FormData) {
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const unitOfMeasure = String(
    formData.get("unitOfMeasure") ?? ""
  ).trim();

  const reorderLevelValue = String(
    formData.get("reorderLevel") ?? ""
  ).trim();

  const categoryIdValue = String(
    formData.get("categoryId") ?? ""
  ).trim();

  if (!sku) {
    throw new Error("SKU is required.");
  }

  if (!name) {
    throw new Error("Item name is required.");
  }

  if (!unitOfMeasure) {
    throw new Error("Unit of measure is required.");
  }

  if (!reorderLevelValue) {
    throw new Error("Reorder level is required.");
  }

  if (!categoryIdValue) {
    throw new Error("Category is required.");
  }

  const reorderLevel = Number(reorderLevelValue);
  const categoryId = Number(categoryIdValue);

  if (
    !Number.isInteger(reorderLevel) ||
    reorderLevel < 0
  ) {
    throw new Error("Reorder level must be zero or a positive integer.");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("A valid category is required.");
  }

  const existingItem = await prisma.item.findUnique({
    where: {
      sku,
    },
  });

  if (existingItem) {
    throw new Error("An item with this SKU already exists.");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Selected category does not exist.");
  }

  /*
   * TODO: Session 3
   * Replace getDemoManager() with requireManager()
   * once authentication is implemented.
   */
  const manager = await getDemoManager();

  const item = await prisma.item.create({
    data: {
      sku,
      name,
      description:
        String(formData.get("description") ?? "").trim() || null,
      unitOfMeasure,
      reorderLevel,
      categoryId,
    },
  });

  await prisma.itemTimelineEvent.create({
    data: {
      itemId: item.id,
      createdById: manager.id,
      eventType: "ITEM_CREATED",
      description: "Item created",
    },
  });

  revalidatePath("/items");
  revalidatePath(`/items/${item.id}`);

  redirect(`/items/${item.id}`);
}

export async function archiveItem(itemId: number) {
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new Error("Invalid item ID.");
  }

  /*
   * TODO: Session 3
   * Replace getDemoManager() with requireManager()
   * once authentication is implemented.
   */
  const manager = await getDemoManager();

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new Error("Item not found.");
  }

  await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      archived: true,
    },
  });

  await prisma.itemTimelineEvent.create({
    data: {
      itemId,
      createdById: manager.id,
      eventType: "ITEM_ARCHIVED",
      description: "Item archived",
    },
  });

  revalidatePath("/items");
  revalidatePath(`/items/${itemId}`);
}

export async function restoreItem(itemId: number) {
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new Error("Invalid item ID.");
  }

  /*
   * TODO: Session 3
   * Replace getDemoManager() with requireManager()
   * once authentication is implemented.
   */
  const manager = await getDemoManager();

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new Error("Item not found.");
  }

  await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      archived: false,
    },
  });

  await prisma.itemTimelineEvent.create({
    data: {
      itemId,
      createdById: manager.id,
      eventType: "ITEM_RESTORED",
      description: "Item restored",
    },
  });

  revalidatePath("/items");
  revalidatePath(`/items/${itemId}`);
}