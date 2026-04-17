import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obrigado(a)! — iLeilão",
  robots: { index: false },
};

export default function EbookObrigadoPage() {
  return (
    <div className="min-h-screen bg-[#f5f0eb] font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-black text-blue-600 tracking-tight">i</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">Leilão</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-4 rounded-3xl overflow-hidden shadow-xl">

          {/* Left — blue card */}
          <div className="bg-blue-700 text-white p-10 flex flex-col items-center justify-between min-h-80 text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Obrigado(a)
              </h1>

              {/* Document illustration */}
              <div className="my-4">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  {/* Hands holding document */}
                  <rect x="30" y="20" width="60" height="75" rx="4" fill="white" fillOpacity=".9"/>
                  <rect x="38" y="30" width="44" height="4" rx="2" fill="#1d4ed8" fillOpacity=".4"/>
                  <rect x="38" y="40" width="44" height="4" rx="2" fill="#1d4ed8" fillOpacity=".4"/>
                  <rect x="38" y="50" width="35" height="4" rx="2" fill="#1d4ed8" fillOpacity=".4"/>
                  <rect x="38" y="60" width="40" height="4" rx="2" fill="#1d4ed8" fillOpacity=".4"/>
                  <rect x="38" y="70" width="28" height="4" rx="2" fill="#1d4ed8" fillOpacity=".4"/>
                  {/* Left hand */}
                  <ellipse cx="38" cy="102" rx="18" ry="10" fill="#f4a261" fillOpacity=".9"/>
                  {/* Right hand */}
                  <ellipse cx="82" cy="102" rx="18" ry="10" fill="#f4a261" fillOpacity=".9"/>
                </svg>
              </div>

              <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
                Ficamos muito felizes com seu interesse.<br />
                Nosso material já está prontinho para você — e nossa equipe vai entrar em contato via WhatsApp em breve!
              </p>
            </div>

            <a
              href="https://drive.google.com/file/d/EBOOK_FILE_ID/view"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm w-full max-w-xs text-center"
            >
              Acessar aqui
            </a>
          </div>

          {/* Right — two panels */}
          <div className="flex flex-col gap-4">
            {/* Photo panel */}
            <div className="flex-1 bg-gray-200 rounded-2xl overflow-hidden min-h-44 flex items-center justify-center">
              {/* Placeholder for a team photo — swap with real image */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="text-3xl">📱</div>
                <p className="text-sm font-semibold text-blue-800">Nossa equipe vai entrar em contato</p>
                <p className="text-xs text-blue-600">
                  Você receberá dicas personalizadas, alertas de leilões no seu estado e recomendações de lotes via WhatsApp.
                </p>
              </div>
            </div>

            {/* Green panel + CTA */}
            <div className="bg-blue-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Explore os leilões agora</p>
                <p className="text-xs text-blue-600">Centenas de imóveis com até 80% de desconto.</p>
              </div>
              <Link
                href="/leiloes"
                className="flex-shrink-0 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl transition text-sm whitespace-nowrap"
              >
                Voltar ao site
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-3 flex items-center gap-2 shadow-lg transition text-sm font-semibold z-50"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Whatsapp
      </a>
    </div>
  );
}
