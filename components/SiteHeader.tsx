"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenuButton } from "./UserDrawer";
import { usePathname } from "next/navigation";

// ── Icons (reusable) ──────────────────────────────────────────────────────────
const Ico = {
  chevron: (open: boolean) => (
    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
};

// ── Nav data ──────────────────────────────────────────────────────────────────
type NavItem = { label: string; href: string; desc?: string };
type NavGroup = { heading?: string; items: NavItem[] };

const LEILOES_GROUPS: NavGroup[] = [
  {
    heading: "Tipo de Imóvel",
    items: [
      { label: "Residenciais",          href: "/leiloes?categoria=IMOVEL&tipo=residencial",   desc: "Apartamentos, casas e sobrados" },
      { label: "Comerciais",            href: "/leiloes?categoria=IMOVEL&tipo=comercial",     desc: "Salas, lojas e galpões" },
      { label: "Rurais",                href: "/leiloes?categoria=IMOVEL&tipo=rural",         desc: "Fazendas, sítios e chácaras" },
      { label: "Terrenos",              href: "/leiloes?categoria=IMOVEL&tipo=terreno",       desc: "Lotes urbanos e rurais" },
    ],
  },
  {
    heading: "Outras Categorias",
    items: [
      { label: "Veículos",              href: "/leiloes?categoria=VEICULO",                   desc: "Carros, motos e caminhões" },
      { label: "Máquinas & Agro",       href: "/leiloes?categoria=MAQUINA",                   desc: "Tratores, escavadeiras e mais" },
      { label: "Bens Diversos",         href: "/leiloes?categoria=DIVERSOS",                  desc: "Informática, móveis e estoque" },
    ],
  },
  {
    heading: "Tipo de Leilão",
    items: [
      { label: "Próximos Leilões",      href: "/leiloes?status=UPCOMING" },
      { label: "Leilões ao Vivo",       href: "/leiloes?status=LIVE" },
      { label: "Agenda de Leilões",     href: "/leiloes/agenda" },
      { label: "Judiciais",             href: "/leiloes/judiciais" },
      { label: "Extrajudiciais",        href: "/leiloes/extrajudiciais" },
      { label: "Alienação Fiduciária",  href: "/leiloes/alienacao-fiduciaria" },
    ],
  },
  {
    heading: "Por Banco / Instituição",
    items: [
      { label: "Itaú Unibanco",         href: "/leiloes/banco/itau" },
      { label: "Caixa Econômica",       href: "/leiloes/banco/caixa" },
      { label: "Banco do Brasil",       href: "/leiloes/banco/bb" },
      { label: "Bradesco",              href: "/leiloes/banco/bradesco" },
      { label: "Santander",             href: "/leiloes/banco/santander" },
    ],
  },
];

const VENDEDORES_GROUPS: NavGroup[] = [
  {
    heading: "Para Leiloeiros",
    items: [
      { label: "Anunciar Leilão",       href: "/vendedores",                    desc: "Publique seu leilão gratuitamente" },
      { label: "Planos & Preços",       href: "/vendedores#planos",             desc: "Veja os planos para comitentes" },
      { label: "Como Funciona",         href: "/vendedores#como-funciona",      desc: "Passo a passo para leiloeiros" },
      { label: "Dashboard Leiloeiro",   href: "/dashboard/leiloeiro",           desc: "Acesse seu painel de controle" },
    ],
  },
  {
    heading: "Para Empresas",
    items: [
      { label: "Leilão Empresarial",    href: "/vendedores#empresarial",        desc: "Bens de recuperação judicial" },
      { label: "Parcerias Bancárias",   href: "/vendedores#bancos",             desc: "Imóveis retomados por bancos" },
      { label: "Contato Comercial",     href: "/contato",                       desc: "Fale com nosso time de vendas" },
    ],
  },
];

const MAIS_GROUPS: NavGroup[] = [
  {
    heading: "Aprender",
    items: [
      { label: "Como Funciona",         href: "/como-funciona",                 desc: "Guia completo para novos compradores" },
      { label: "Glossário",             href: "/glossario",                     desc: "Termos jurídicos e leiloeiros" },
      { label: "Blog",                  href: "/blog",                          desc: "Dicas, notícias e análises" },
      { label: "eBook Grátis",          href: "/ebook",                         desc: "Guia do Arrematante Inteligente" },
    ],
  },
  {
    heading: "Sobre a iLeilão",
    items: [
      { label: "Sobre Nós",             href: "/sobre" },
      { label: "Código de Ética",       href: "/etica" },
      { label: "Imprensa / Mídia",      href: "/midia" },
      { label: "Termos de Uso",         href: "/termos" },
      { label: "Privacidade",           href: "/privacidade" },
    ],
  },
];

const CONTATO_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Enviar Mensagem",       href: "/contato",                       desc: "Resposta em até 1 dia útil" },
      { label: "Agendar Reunião",       href: "/contato#agendar",               desc: "Escolha dia e horário" },
      { label: "WhatsApp",             href: "https://wa.me/5511999990000",     desc: "+55 11 99999-0000" },
      { label: "Central de Ajuda",      href: "/como-funciona",                 desc: "Perguntas frequentes" },
      { label: "Denúncias & Ética",     href: "/etica",                         desc: "Canal de ética corporativo" },
    ],
  },
];

const INDICA_GROUPS: NavGroup[] = [
  {
    heading: "Indique e Ganhe",
    items: [
      { label: "Indicar Leiloeiro",     href: "/dashboard?indicar=leiloeiro",   desc: "Ganhe comissão por indicação" },
      { label: "Indicar Comprador",     href: "/dashboard?indicar=comprador",   desc: "Traga novos compradores" },
      { label: "Programa de Afiliados", href: "/vendedores#afiliados",          desc: "Link rastreável e dashboard" },
      { label: "Ver Minhas Indicações", href: "/dashboard",                     desc: "Acompanhe seus ganhos" },
    ],
  },
];

// ── Dropdown panel ────────────────────────────────────────────────────────────
function Dropdown({ groups, mega, close }: { groups: NavGroup[]; mega?: boolean; close: () => void }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-4
      ${mega ? "w-[780px] grid grid-cols-4 gap-0 px-2" : "w-64 px-2"}`}>
      {groups.map((g, gi) => (
        <div key={gi} className={mega ? "px-3 py-1" : ""}>
          {g.heading && (
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 mb-1.5 mt-1">{g.heading}</p>
          )}
          {g.items.map(item => (
            <Link key={item.href} href={item.href} onClick={close}
              className="flex flex-col px-2.5 py-2 rounded-xl hover:bg-blue-50 transition-colors group">
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-none">{item.label}</span>
              {item.desc && <span className="text-[11px] text-gray-400 mt-0.5">{item.desc}</span>}
            </Link>
          ))}
          {gi < groups.length - 1 && !mega && <div className="h-px bg-gray-100 my-1.5 mx-2" />}
        </div>
      ))}
    </div>
  );
}

// ── Nav entry with dropdown ────────────────────────────────────────────────────
function NavMenu({ label, groups, mega }: { label: string; groups: NavGroup[]; mega?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => setOpen(false), []);

  function onEnter() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }
  function onLeave() {
    timer.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${open ? "text-blue-700 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
      >
        {label}
        {Ico.chevron(open)}
      </button>
      {open && <Dropdown groups={groups} mega={mega} close={close} />}
    </div>
  );
}

// ── SiteHeader ────────────────────────────────────────────────────────────────
export function SiteHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const mobileLinks = [
    { label: "Leilões",             href: "/leiloes" },
    { label: "Imóveis",             href: "/leiloes?categoria=IMOVEL" },
    { label: "Veículos",            href: "/leiloes?categoria=VEICULO" },
    { label: "Máquinas & Agro",     href: "/leiloes?categoria=MAQUINA" },
    { label: "Próximos Leilões",    href: "/leiloes?status=UPCOMING" },
    { label: "Leilões ao Vivo",     href: "/leiloes?status=LIVE" },
    { label: "Vendedores",          href: "/vendedores" },
    { label: "Como Funciona",       href: "/como-funciona" },
    { label: "Blog",                href: "/blog" },
    { label: "Fale Conosco",        href: "/contato" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 flex-shrink-0">
          <span className="text-2xl font-black text-blue-600 tracking-tight">i</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">Leilão</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          <NavMenu label="Leilões"             groups={LEILOES_GROUPS}   mega />
          <NavMenu label="Vendedores"          groups={VENDEDORES_GROUPS} />
          <NavMenu label="Mais"                groups={MAIS_GROUPS} />
          <NavMenu label="Fale Conosco"        groups={CONTATO_GROUPS} />
          <NavMenu label="Indique o Leiloeiro" groups={INDICA_GROUPS} />
        </nav>

        {/* Auth + hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/vendedores"
            className="hidden md:block text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-full transition-all">
            Quero Vender
          </Link>

          {session ? (
            <UserMenuButton />
          ) : (
            <>
              <Link href="/auth/register"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors hidden md:block">
                Cadastre-se
              </Link>
              <Link href="/auth/login"
                className="text-sm font-semibold border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all hidden sm:block">
                Login
              </Link>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {mobileLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              {l.label}
            </Link>
          ))}
          {!session && (
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
              <Link href="/auth/login"
                className="flex-1 text-center text-sm font-bold border-2 border-blue-600 text-blue-600 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition">
                Login
              </Link>
              <Link href="/auth/register"
                className="flex-1 text-center text-sm font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">
                Cadastre-se
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
