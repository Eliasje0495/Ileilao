import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_POSTS } from "@/lib/seo-data";

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | iLeilão Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://ileilao.com/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "iLeilão" },
    publisher: { "@type": "Organization", name: "iLeilão", url: "https://ileilao.com" },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.title.slice(0, 40) + "..." },
      ]} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl h-48 flex items-center justify-center mb-8">
          <span className="text-6xl">📖</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400">{post.readTime} de leitura</span>
          <span className="text-xs text-gray-400">
            {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500 text-base mb-8 border-l-4 border-blue-200 pl-4">{post.excerpt}</p>

        <div
          className="prose prose-sm prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>").replace(/## (.*)/g, "<h2>$1</h2>").replace(/### (.*)/g, "<h3>$1</h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
        />

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/leiloes"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Explorar leilões →
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-base font-bold text-gray-900 mb-4">Artigos relacionados</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-1">{p.title}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{p.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
