import type { MetadataRoute } from "next";
import { ESTADOS_MAP, BANCO_MAP, GLOSSARIO_TERMS, BLOG_POSTS } from "@/lib/seo-data";

const BASE = "https://ileilao.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                               lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/leiloes`,                  lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/leiloes/imoveis`,          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/leiloes/veiculos`,         lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/leiloes/maquinas`,         lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/leiloes/terrenos`,         lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/leiloes/judiciais`,        lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/leiloes/extrajudiciais`,   lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/leiloes/alienacao-fiduciaria`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/leiloes/agenda`,           lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/como-funciona`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/glossario`,                lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/sobre`,                    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contato`,                  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/termos`,                   lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacidade`,              lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // State pages: /leiloes/imoveis/sp, /leiloes/veiculos/rj, etc.
  const statePages: MetadataRoute.Sitemap = Object.keys(ESTADOS_MAP).flatMap(slug => [
    { url: `${BASE}/leiloes/imoveis/${slug}`,  lastModified: now, changeFrequency: "daily" as const,  priority: 0.85 },
    { url: `${BASE}/leiloes/veiculos/${slug}`, lastModified: now, changeFrequency: "daily" as const,  priority: 0.75 },
  ]);

  // Bank pages
  const bankPages: MetadataRoute.Sitemap = Object.keys(BANCO_MAP).map(slug => ({
    url: `${BASE}/leiloes/banco/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Glossary terms
  const glossaryPages: MetadataRoute.Sitemap = GLOSSARIO_TERMS.map(t => ({
    url: `${BASE}/glossario/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...statePages, ...bankPages, ...glossaryPages, ...blogPages];
}
