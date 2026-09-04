import { requireUser } from "@/lib/auth";

export default async function MovementsPage() {
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Stock Movements</h1>

      <p className="mt-2 text-gray-600">
        Receipts, issues, transfers, and adjustments will appear here.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Stock movement functionality will be added later.
        </p>
      </div>
    </div>
  );
}