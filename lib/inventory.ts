import { prisma } from "./prisma";
import {
  getItemStockByLocation,
  getItemTotalStock,
} from "./stock";

export async function getItemsForList() {
  const items = await prisma.item.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return Promise.all(
    items.map(async (item) => {
      const totalOnHand = await getItemTotalStock(item.id);

      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        description: item.description,
        unitOfMeasure: item.unitOfMeasure,
        reorderLevel: item.reorderLevel,
        archived: item.archived,
        category: item.category,
        totalOnHand,
      };
    })
  );
}

export async function getItemDetail(itemId: number) {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      category: true,
      stockMovements: {
        include: {
          performedBy: true,
          location: true,
          sourceLocation: true,
          destinationLocation: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  const stockByLocationData = await getItemStockByLocation(itemId);

const stockByLocation = stockByLocationData.map((stock) => ({
  location: {
    id: stock.locationId,
    name: stock.locationName,
  },
  quantity: stock.quantity,
}));

  return {
    id: item.id,
    sku: item.sku,
    name: item.name,
    description: item.description,
    unitOfMeasure: item.unitOfMeasure,
    reorderLevel: item.reorderLevel,
    archived: item.archived,
    category: item.category,
    movements: item.stockMovements,
    stockByLocation,
  };
}

export async function getLocationsForList() {
  const locations = await prisma.location.findMany({
    include: {
      _count: {
        select: {
          staffAssignments: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return locations.map((location) => ({
    id: location.id,
    name: location.name,
    code: location.code,
    address: location.address,
    assignedStaffCount: location._count.staffAssignments,
    createdAt: location.createdAt,
  }));
}

export async function getCategoriesForList() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    itemCount: category._count.items,
  }));
}