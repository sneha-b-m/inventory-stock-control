import Link from "next/link";
import { getItemsForList } from "@/lib/inventory";

export default async function ItemsPage() {
  const items = await getItemsForList();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Items</h1>

          <p className="mt-2 text-gray-600">
            View inventory items and their current stock levels.
          </p>
        </div>

        <Link
          href="/items/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create item
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                SKU
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Unit of Measure
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Reorder Level
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Total on Hand
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm">{item.sku}</td>

                <td className="px-4 py-3 text-sm font-medium">
                  {item.name}
                </td>

                <td className="px-4 py-3 text-sm">
                  {item.category.name}
                </td>

                <td className="px-4 py-3 text-sm">
                  {item.unitOfMeasure}
                </td>

                <td className="px-4 py-3 text-sm">
                  {item.reorderLevel}
                </td>

                <td className="px-4 py-3 text-sm font-medium">
                  {item.totalOnHand}
                </td>

                <td className="px-4 py-3 text-sm">
                  {item.archived ? "Archived" : "Active"}
                </td>

                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/items/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}