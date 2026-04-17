"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenuButton } from "./UserDrawer";

// ── Mega-menu data ────────────────────────────────────────────────────────────
const TIPO_IMOVEL = [
  { label: "Residenciais",   href: "/leiloes?categoria=IMOVEL&tipo=residencial",  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
  { label: "Comerciais",     href: "/leiloes?categoria=IMOVEL&tipo=comercial",    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg> },
  { label: "Rurais",         href: "/leiloes?categoria=IMOVEL&tipo=rural",        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> },
  { label: "Terrenos",       href: "/leiloes?categoria=IMOVEL&tipo=terreno",      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
];

const OUTRAS = [
  { label: "Veículos",       href: "/leiloes?categoria=VEICULO", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
  { label: "Máquinas & Agro",href: "/leiloes?categoria=MAQUINA", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg> },
  { label: "Bens Diversos",  href: "/leiloes?categoria=DIVERSOS", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
];

const TIPO_LEILAO = [
  { label: "Próximos Leilões",        href: "/leiloes?status=UPCOMING", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: "Leilões ao Vivo",         href: "/leiloes?status=LIVE",     icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg> },
  { label: "Agenda de Leilões",       href: "/leiloes/agenda",          icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
  { label: "Leilões Judiciais",       href: "/leiloes?tipo=judicial",   icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 5.491z" /></svg> },
  { label: "Leilões Extrajudiciais",  href: "/leiloes?tipo=extrajudicial", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg> },
  { label: "Alienação Fiduciária",    href: "/leiloes?tipo=fiduciaria",  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
  { label: "Leilões Encerrados",      href: "/leiloes?status=ENDED",    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function SiteHeader() {
  const [megaOpen, setMegaOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 flex-shrink-0">
          <span className="text-2xl font-black text-blue-600 tracking-tight">i</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">Leilão</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700 relative" ref={menuRef}>
          {/* Leilões with mega dropdown */}
          <div className="relative">
            <button
              onClick={() => setMegaOpen(v => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors ${megaOpen ? "text-blue-700 bg-blue-50" : ""}`}
            >
              Leilões
              <svg className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>

            {/* Mega menu panel */}
            {megaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50">
                <div className="grid grid-cols-3 gap-6">
                  {/* Col 1: Tipo de imóvel */}
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Tipo de imóvel</p>
                    <div className="space-y-1">
                      {TIPO_IMOVEL.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                          <span className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mt-5 mb-3">Outras Oportunidades</p>
                    <div className="space-y-1">
                      {OUTRAS.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                          <span className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Status extra */}
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Condição</p>
                    <div className="space-y-1">
                      {[
                        { label: "Imóveis desocupados",        href: "/leiloes?condicao=desocupado", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                        { label: "Recebendo Propostas",         href: "/leiloes?condicao=proposta",   icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                        { label: "1º Leilão",                   href: "/leiloes?praca=1",             icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" /></svg> },
                        { label: "2º Leilão",                   href: "/leiloes?praca=2",             icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" /></svg> },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                          <span className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Tipo de leilão */}
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Tipo de leilão</p>
                    <div className="space-y-1">
                      {TIPO_LEILAO.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                          <span className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/vendedores" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Vendedores</Link>
          <Link href="/como-funciona" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Como funciona</Link>
          <Link href="/contato" className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Fale Conosco</Link>
        </nav>

        {/* Auth / User */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {session ? (
            <UserMenuButton />
          ) : (
            <>
              <Link href="/auth/register" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors hidden md:block">
                Cadastre-se
              </Link>
              <Link href="/auth/login" className="text-sm font-semibold border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
