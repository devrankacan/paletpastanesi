import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <div className="min-h-[60vh]">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-amber-900">
            Yönetim Paneli
          </span>
          <nav className="flex gap-4 text-sm font-medium text-stone-600">
            <Link href="/admin" className="hover:text-amber-700">
              Genel Bakış
            </Link>
            <Link href="/admin/urunler" className="hover:text-amber-700">
              Ürünler
            </Link>
            <Link href="/admin/siparisler" className="hover:text-amber-700">
              Siparişler
            </Link>
          </nav>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-stone-500 hover:text-red-600"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
