import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_POSTS } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog de Leilões — Guias, Dicas e Estratégias | iLeilão",
  description: "Artigos sobre como participar de leilões de imóveis e veículos: diferenças entre judicial e extrajudicial, como lidar com imóvel ocupado, como ler editais e muito mais.",
  keywords: ["blog leilões", "guia leilão imóvel", "dicas leilão", "como arrematar imóvel"],
  alternates: { canonical: "https://ileilao.com/blog" },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Blog iLeilão</h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Guias práticos, estratégias e tudo que você precisa saber para arrematar com segurança.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center">
                <span className="text-4xl">{post.category === "Guia" ? "📖" : "📰"}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h2 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-700 transition">{post.title}</h2>
                <p className="text-xs text-gray-500 line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                  <span className="text-xs text-blue-600 group-hover:underline">Ler artigo →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Pronto para participar?</h2>
          <p className="text-blue-100 text-sm mb-5">Cadastre-se grátis e explore centenas de lotes em leilão.</p>
          <Link href="/auth/register"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
            Criar conta grátis
          </Link>
        </div>
      </section>
    </div>
  );
}
