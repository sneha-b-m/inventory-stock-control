import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inventory & Stock Control",
  description: "Inventory and stock control application",
};

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Items", href: "/items" },
  { name: "Locations", href: "/locations" },
  { name: "Movements", href: "/movements" },
  { name: "Users / Assignments", href: "/users" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-5">
              <h1 className="text-lg font-semibold">
                Inventory Control
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Stock Management
              </p>
            </div>

            <nav className="px-4 py-6">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Navigation
              </p>

              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
              <div>
                <h2 className="text-base font-medium">
                  Inventory & Stock Control
                </h2>
              </div>

              <div className="text-sm text-gray-500">
                Session 1
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}