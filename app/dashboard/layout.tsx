import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const isLeiloeiro = session.user.role === Role.LEILOEIRO || session.user.role === Role.ADMIN;
  const isAdmin = session.user.role === Role.ADMIN;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo + section divider */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-xl font-black text-blue-600 tracking-tight">i</span>
              <span className="text-xl font-black text-gray-900 tracking-tight">Leilão</span>
            </Link>
            <span className="text-gray-300 text-lg font-light">|</span>
            <Link href="/dashboard/auditorio" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              Auditório
            </Link>
          </div>

          {/* Right nav */}
          <DashboardNav
            userName={session.user.name}
            isLeiloeiro={isLeiloeiro}
            isAdmin={isAdmin}
          />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
