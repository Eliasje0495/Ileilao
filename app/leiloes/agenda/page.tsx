import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Agenda de Leilões — Próximos Leilões Online | iLeilão",
  description: "Confira a agenda completa de leilões online no Brasil. Veja os próximos leilões de imóveis, veículos e máquinas por data, estado e categoria.",
  keywords: ["agenda leilões", "próximos leilões", "calendário leilões", "leilões esta semana"],
  alternates: { canonical: "https://ileilao.com/leiloes/agenda" },
};

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Agenda" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Agenda de Leilões</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Próximos leilões de imóveis, veículos e máquinas em todo o Brasil. Filtre por data, estado e categoria.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Hoje", href: "/leiloes?periodo=hoje" },
              { label: "Esta semana", href: "/leiloes?periodo=semana" },
              { label: "Este mês", href: "/leiloes?periodo=mes" },
              { label: "Ao Vivo agora", href: "/leiloes?status=LIVE" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Próximos leilões</h2>
          <Link href="/leiloes?sort=dataAsc" className="text-sm text-blue-600 hover:underline">Ver todos →</Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-400 text-sm">
          <p className="mb-3">📅</p>
          <p>A agenda é carregada em tempo real.</p>
          <Link href="/leiloes?sort=dataAsc"
            className="mt-4 inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver leilões por data →
          </Link>
        </div>
      </section>
    </div>
  );
}
