import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Leilões",
    links: [
      { label: "Todos os Leilões",        href: "/leiloes" },
      { label: "Imóveis",                 href: "/leiloes?categoria=IMOVEL" },
      { label: "Veículos",                href: "/leiloes?categoria=VEICULO" },
      { label: "Máquinas & Agro",         href: "/leiloes?categoria=MAQUINA" },
      { label: "Bens Diversos",           href: "/leiloes?categoria=DIVERSOS" },
      { label: "Judiciais",               href: "/leiloes/judiciais" },
      { label: "Extrajudiciais",          href: "/leiloes/extrajudiciais" },
      { label: "Alienação Fiduciária",    href: "/leiloes/alienacao-fiduciaria" },
      { label: "Agenda de Leilões",       href: "/leiloes/agenda" },
    ],
  },
  {
    heading: "Vendedores",
    links: [
      { label: "Quero Vender",            href: "/quero-vender" },
      { label: "Como Anunciar",           href: "/vendedores" },
      { label: "Planos & Preços",         href: "/vendedores#planos" },
      { label: "Leilão para Bancos",      href: "/vendedores#bancos" },
      { label: "Leilão Empresarial",      href: "/vendedores#empresarial" },
      { label: "Programa de Afiliados",   href: "/vendedores#afiliados" },
    ],
  },
  {
    heading: "Aprender",
    links: [
      { label: "Como Funciona",           href: "/como-funciona" },
      { label: "Glossário",               href: "/glossario" },
      { label: "Blog",                    href: "/blog" },
      { label: "eBook Grátis",            href: "/ebook" },
      { label: "Leilão Judicial",         href: "/leiloes/judiciais" },
      { label: "Dicas para Arrematantes", href: "/blog" },
    ],
  },
  {
    heading: "Empresa",
    links: [
      { label: "Sobre a iLeilão",         href: "/sobre" },
      { label: "Código de Ética",         href: "/etica" },
      { label: "Imprensa / Mídia",        href: "/midia" },
      { label: "Fale Conosco",            href: "/contato" },
      { label: "Agendar Reunião",         href: "/contato" },
      { label: "Termos de Uso",           href: "/termos" },
      { label: "Privacidade",             href: "/privacidade" },
    ],
  },
];

const BANCOS = ["Itaú Unibanco", "Caixa Econômica", "Bradesco", "Santander", "Banco do Brasil", "BTG Pactual", "Sicoob", "Daycoval"];

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      {/* Top CTA strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Pronto para arrematar com desconto?</p>
            <p className="text-gray-400 text-sm mt-0.5">Cadastre-se grátis e participe dos próximos leilões.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
              Criar conta grátis
            </Link>
            <Link href="/quero-vender"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition text-sm">
              Quero Vender
            </Link>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {FOOTER_LINKS.map(col => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bancos */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Leilões por Instituição</h3>
          <div className="flex flex-wrap gap-2">
            {BANCOS.map(b => (
              <Link key={b} href={`/leiloes/banco/${b.toLowerCase().replace(/\s+/g,"-")}`}
                className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors">
                {b}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-blue-500">i</span>
            <span className="text-2xl font-black text-white">Leilão</span>
          </div>

          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} iLeilão. Plataforma brasileira de leilões online. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/etica" className="hover:text-white transition-colors">Ética</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
