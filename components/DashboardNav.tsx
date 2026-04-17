"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  userName: string;
  isLeiloeiro: boolean;
  isAdmin?: boolean;
}

export function DashboardNav({ userName, isLeiloeiro, isAdmin }: Props) {
  const pathname = usePathname();
  const first = userName.split(" ")[0];

  const links = [
    { href: "/dashboard/auditorio", label: "Ao Vivo" },
    { href: "/dashboard", label: "Dashboard", exact: true },
    { href: "/dashboard/kyc", label: "KYC" },
    ...(isLeiloeiro ? [{ href: "/dashboard/leiloeiro", label: "Meus Leilões" }] : []),
    ...(isAdmin ? [{ href: "/dashboard/admin", label: "Admin" }] : []),
    { href: "/leiloes", label: "Explorar" },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(l.href, l.exact)
              ? "bg-blue-50 text-blue-700"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {l.label}
        </Link>
      ))}
      <span className="w-px h-5 bg-gray-200 mx-1" />
      <div className="flex items-center gap-2 pl-1">
        <span className="text-sm font-medium text-gray-700">Olá, {first}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
