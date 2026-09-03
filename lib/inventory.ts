import { prisma } from "./prisma";

export async function getItemsForList() {
  const items = await prisma.item.findMany({
    include: {
      category: true,
      stockMovements: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return items.map((item) => {
    const totalOnHand = item.stockMovements.reduce((stock, movement) => {
      switch (movement.kind) {
        case "RECEIPT":
          return stock + movement.quantity;

        case "ISSUE":
          return stock - movement.quantity;

        case "ADJUSTMENT":
          return stock + movement.quantity;

        case "TRANSFER":
          return stock;

        default:
          return stock;
      }
    }, 0);

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
  });
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

  const stockByLocation = new Map<
    number,
    {
      location: typeof item.stockMovements[number]["location"];
      quantity: number;
    }
  >();

  for (const movement of item.stockMovements) {
    if (
      movement.kind === "RECEIPT" ||
      movement.kind === "ISSUE" ||
      movement.kind === "ADJUSTMENT"
    ) {
      if (movement.locationId !== null) {
        const current = stockByLocation.get(movement.locationId);

        const change =
          movement.kind === "ISSUE"
            ? -movement.quantity
            : movement.quantity;

        stockByLocation.set(movement.locationId, {
          location: movement.location,
          quantity: (current?.quantity ?? 0) + change,
        });
      }
    }

    if (movement.kind === "TRANSFER") {
      if (movement.sourceLocationId !== null) {
        const current = stockByLocation.get(movement.sourceLocationId);

        stockByLocation.set(movement.sourceLocationId, {
          location: movement.sourceLocation,
          quantity: (current?.quantity ?? 0) - movement.quantity,
        });
      }

      if (movement.destinationLocationId !== null) {
        const current = stockByLocation.get(
          movement.destinationLocationId
        );

        stockByLocation.set(movement.destinationLocationId, {
          location: movement.destinationLocation,
          quantity: (current?.quantity ?? 0) + movement.quantity,
        });
      }
    }
  }

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
    stockByLocation: Array.from(stockByLocation.values()),
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