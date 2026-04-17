"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

// Simplified city list — expandable per UF via API
const CIDADES_POR_UF: Record<string, string[]> = {
  SP: ["São Paulo","Campinas","Santos","Ribeirão Preto","Sorocaba","São José dos Campos","Osasco","Guarulhos","Bauru","Piracicaba"],
  RJ: ["Rio de Janeiro","Niterói","Duque de Caxias","Nova Iguaçu","Campos dos Goytacazes","Petrópolis","Volta Redonda"],
  MG: ["Belo Horizonte","Uberlândia","Contagem","Juiz de Fora","Montes Claros","Betim","Governador Valadares"],
  RS: ["Porto Alegre","Caxias do Sul","Canoas","Pelotas","Santa Maria","Novo Hamburgo"],
  PR: ["Curitiba","Londrina","Maringá","Ponta Grossa","Cascavel","São José dos Pinhais"],
  SC: ["Florianópolis","Joinville","Blumenau","São José","Criciúma","Chapecó"],
  BA: ["Salvador","Feira de Santana","Vitória da Conquista","Camaçari","Itabuna"],
  GO: ["Goiânia","Aparecida de Goiânia","Anápolis","Ribeirão das Neves"],
  DF: ["Brasília","Taguatinga","Ceilândia","Gama","Samambaia"],
  CE: ["Fortaleza","Caucaia","Juazeiro do Norte","Maracanaú","Sobral"],
  PE: ["Recife","Caruaru","Olinda","Petrolina","Paulista"],
  AM: ["Manaus","Parintins","Itacoatiara","Manacapuru"],
  PA: ["Belém","Ananindeua","Santarém","Marabá"],
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", uf: "",
  });
  const [cidades, setCidades] = useState<string[]>([]);
  const [cidadeInput, setCidadeInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "uf") setCidades([]); // reset cidades on UF change
  }

  function addCidade(cidade: string) {
    if (!cidade || cidades.includes(cidade) || cidades.length >= 5) return;
    setCidades((prev) => [...prev, cidade]);
    setCidadeInput("");
  }

  function removeCidade(cidade: string) {
    setCidades((prev) => prev.filter((c) => c !== cidade));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) { setError("As senhas não coincidem."); return; }
    if (form.password.length < 6) { setError("A senha deve ter no mínimo 6 caracteres."); return; }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, uf: form.uf || null, cidades }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Erro ao criar conta."); return; }
    router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
  }

  const cidadesDisponiveis = (CIDADES_POR_UF[form.uf] ?? []).filter(
    (c) => !cidades.includes(c) && c.toLowerCase().includes(cidadeInput.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600 tracking-tight">i</span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Leilão</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar conta grátis</h1>
          <p className="text-sm text-gray-500 mb-6">
            Já tem conta?{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Entrar</Link>
          </p>

          {/* Social / SSO buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/onboarding" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-xl transition text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Cadastrar com GitHub
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Cadastrar com Google
            </button>
            <button
              type="button"
              onClick={() => signIn("apple", { callbackUrl: "/onboarding" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              <svg width="16" height="18" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-150.3-86.4c-44.2-47.4-87.3-119.3-87.3-186.7 0-81.3 61.1-137.5 95.9-161.5 38.3-26 99.4-43.7 160.6-43.7 52.5 0 99.4 18 137.9 48.4 38.5 30.4 60.2 48.4 86.9 48.4 23.5 0 53.7-18.3 90.6-43.7 47.6-31.8 106.3-52.3 176.9-52.3zm-190.5-138.7c-40.5 48.2-106.3 85.3-160.6 85.3-8.3 0-16.6-.6-21.9-1.9-1.3-5.1-1.9-10.8-1.9-16.6 0-43.7 18-90 54.3-126.9 18-18.7 40.8-34.6 68.7-47.4 27.3-12.2 53.7-18.7 77.8-20.1.7 2.6.7 5.8.7 9 0 44.3-18.1 90.5-16.1 118.6z"/>
              </svg>
              Cadastrar com Apple
            </button>
            <button
              type="button"
              onClick={() => signIn("govbr", { callbackUrl: "/onboarding" })}
              className="w-full flex items-center justify-center gap-3 border border-[#1351B4] bg-white hover:bg-blue-50 text-[#1351B4] font-medium py-3 rounded-xl transition text-sm"
            >
              <span className="w-[18px] h-[18px] rounded-full bg-[#1351B4] text-white text-[9px] font-black flex items-center justify-center leading-none">
                gov
              </span>
              Cadastrar com Gov.br
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">ou preencha os dados abaixo</div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome ou Razão Social */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome ou Razão Social Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text" required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Informe nome ou razão social completo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* UF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UF de interesse</label>
              <select value={form.uf} onChange={e => set("uf", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
                <option value="">[ Selecione a UF ]</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>

            {/* Cidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade de interesse
                <span className="text-xs text-gray-400 font-normal ml-1">Você pode escolher até 5 cidades</span>
              </label>

              {/* Selected cities */}
              {cidades.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cidades.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {c}
                      <button type="button" onClick={() => removeCidade(c)} className="hover:text-red-500 transition">×</button>
                    </span>
                  ))}
                </div>
              )}

              {cidades.length < 5 && (
                <div className="relative">
                  <input
                    type="text" value={cidadeInput}
                    onChange={e => setCidadeInput(e.target.value)}
                    placeholder={form.uf ? "Digite para buscar..." : "Selecione a UF primeiro"}
                    disabled={!form.uf}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {cidadeInput && cidadesDisponiveis.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {cidadesDisponiveis.map(c => (
                        <button key={c} type="button" onClick={() => addCidade(c)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition first:rounded-t-xl last:rounded-b-xl">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email" required value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="Informe seu melhor email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password" required value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="Crie sua senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">Mínimo de 6 caracteres</p>
            </div>

            {/* Confirmação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmação de Senha</label>
              <input
                type="password" required value={form.confirm} onChange={e => set("confirm", e.target.value)}
                placeholder="Digite novamente sua senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 mt-2">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          {/* Gov.br divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">ou entre com</span></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/api/auth/govbr"}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#1351b4] text-[#1351b4] font-semibold py-3 rounded-xl hover:bg-[#1351b4] hover:text-white transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            Entrar com Gov.br
          </button>

          <p className="mt-5 text-center text-xs text-gray-400">
            Ao criar conta, você concorda com os{" "}
            <Link href="/termos" className="underline">Termos de Uso</Link> e{" "}
            <Link href="/privacidade" className="underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
