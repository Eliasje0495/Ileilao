interface FaqItem { q: string; a: string }

export function FaqBlock({ items, title = "Perguntas frequentes" }: { items: FaqItem[]; title?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(i => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex justify-between items-start cursor-pointer list-none gap-4">
                <span className="text-sm font-semibold text-gray-900 group-open:text-blue-700 pr-2">{item.q}</span>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-3 pr-8">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
