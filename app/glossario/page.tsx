import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GLOSSARIO_TERMS } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Glossário de Leilões — Termos e Definições | iLeilão",
  description: "Dicionário completo com os principais termos usados em leilões de imóveis e veículos: alienação fiduciária, hasta pública, arrematação, edital e muito mais.",
  keywords: ["glossário leilão", "termos leilão", "o que é alienação fiduciária", "o que é hasta pública", "vocabulário leilão"],
  alternates: { canonical: "https://ileilao.com/glossario" },
};

export default function GlossarioPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Glossário" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Glossário de Leilões</h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Todos os termos importantes que você precisa saber para participar de leilões com segurança e confiança.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {GLOSSARIO_TERMS.map(term => (
            <Link key={term.slug} href={`/glossario/${term.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-300 hover:bg-blue-50 transition group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 mb-1">{term.termo}</h2>
                  <p className="text-xs text-gray-500 line-clamp-2">{term.def}</p>
                </div>
                <span className="text-blue-400 text-sm flex-shrink-0">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/como-funciona"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver como funciona o leilão →
          </Link>
        </div>
      </section>
    </div>
  );
}
