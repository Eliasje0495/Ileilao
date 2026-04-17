import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada — iLeilão",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600 tracking-tight">i</span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Leilão</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16 text-center">
        <div>
          <p className="text-8xl font-black text-blue-100 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              Voltar para o início
            </Link>
            <Link href="/leiloes"
              className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-blue-400 hover:text-blue-700 transition">
              Ver leilões
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
