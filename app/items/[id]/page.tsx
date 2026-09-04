import { archiveItem, restoreItem } from "@/app/actions/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemDetail } from "@/lib/inventory";
import { requireUser } from "@/lib/auth";

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  await requireUser();

  const { id } = await params;

  const item = await getItemDetail(Number(id));

  if (!item) {
    notFound();
  }

  const totalOnHand = item.stockByLocation.reduce(
    (total, stock) => total + stock.quantity,
    0
  );

  return (
    <main>
      <div className="mb-6">
        <Link
          href="/items"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to items
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{item.name}</h1>

            <p className="mt-1 text-sm text-gray-600">
              Item details and stock history
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!item.archived && (
              <Link
                href={`/movements/new?itemId=${item.id}`}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Record movement
              </Link>
            )}

            {item.archived ? (
              <form action={restoreItem.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Restore
                </button>
              </form>
            ) : (
              <form action={archiveItem.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Archive
                </button>
              </form>
            )}

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                item.archived
                  ? "bg-gray-100 text-gray-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.archived ? "Archived" : "Active"}
            </span>
          </div>
        </div>

        <p className="mt-3 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Archived items will be blocked from new stock movements in a later session.
        </p>
      </div>

      {/* Item information */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Item Information</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">SKU</p>
            <p className="mt-1 font-medium">{item.sku}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="mt-1 font-medium">{item.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="mt-1">{item.category.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Unit of Measure</p>
            <p className="mt-1">{item.unitOfMeasure}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reorder Level</p>
            <p className="mt-1">{item.reorderLevel}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total on Hand</p>
            <p className="mt-1 text-lg font-semibold">{totalOnHand}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">
              {item.description || "No description available."}
            </p>
          </div>
        </div>
      </section>

      {/* Stock by location */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Stock by Location</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {item.stockByLocation.map((stock) => (
                <tr key={stock.location?.id}>
                  <td className="px-4 py-3 text-sm">
                    {stock.location?.name || "Unknown location"}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium">
                    {stock.quantity}
                  </td>
                </tr>
              ))}

              {item.stockByLocation.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No stock recorded at any location.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Movement history */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Movement History</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Kind
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Performed By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Reason / Notes
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {item.movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {movement.createdAt.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                    {movement.kind}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {movement.quantity}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {movement.location?.name || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {movement.sourceLocation?.name || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {movement.destinationLocation?.name || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {movement.performedBy.name}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {movement.reason || movement.notes || "—"}
                  </td>
                </tr>
              ))}

              {item.movements.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No movement history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}