"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DOC_TYPES = [
  { key: "CPF", label: "CPF", desc: "Foto do documento CPF" },
  { key: "RG", label: "RG / CNH", desc: "Documento de identidade com foto" },
  { key: "COMPROVANTE", label: "Comprovante de residência", desc: "Conta de água, luz ou telefone (últimos 90 dias)" },
];

interface UploadedDoc { type: string; url: string }

export default function KycPage() {
  const { data: session } = useSession();
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(type: string, file: File) {
    setError("");
    setLoading(type);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/kyc/upload", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) { setError(data.error ?? "Erro ao enviar documento."); return; }
    setUploaded(prev => [...prev.filter(d => d.type !== type), { type, url: data.url }]);
  }

  async function submitKyc() {
    setError(""); setLoading("submit");
    const res = await fetch("/api/kyc/submit", { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) { setError(data.error ?? "Erro ao enviar."); return; }
    setSubmitted(true);
  }

  if (session?.user.kycStatus === "VERIFIED") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Identidade verificada</h1>
        <p className="text-gray-500 text-sm mb-6">Você está aprovado para participar de leilões.</p>
        <Link href="/leiloes" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Ver leilões
        </Link>
      </div>
    );
  }

  if (submitted || session?.user.kycStatus === "PENDING") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Documentos enviados</h1>
        <p className="text-gray-500 text-sm">Nossa equipe irá analisar seus documentos em até 24 horas.</p>
      </div>
    );
  }

  const allUploaded = DOC_TYPES.every(d => uploaded.find(u => u.type === d.key));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificação de identidade</h1>
        <p className="text-gray-500 text-sm mt-1">Envie os documentos abaixo para liberar sua participação em leilões.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="space-y-4">
        {DOC_TYPES.map(doc => {
          const done = uploaded.find(u => u.type === doc.key);
          return (
            <div key={doc.key} className={`bg-white rounded-2xl border p-5 flex items-center justify-between gap-4 ${done ? "border-green-200" : "border-gray-100"}`}>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{doc.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{doc.desc}</div>
                {done && <div className="text-xs text-green-600 font-semibold mt-1">✓ Enviado</div>}
              </div>
              <label className={`flex-shrink-0 cursor-pointer text-sm font-semibold px-4 py-2 rounded-xl transition ${
                done ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}>
                {loading === doc.key ? "Enviando..." : done ? "Alterar" : "Enviar"}
                <input type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(doc.key, f); }} />
              </label>
            </div>
          );
        })}
      </div>

      <button
        onClick={submitKyc}
        disabled={!allUploaded || loading === "submit"}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading === "submit" ? "Enviando..." : "Enviar para verificação"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Seus documentos são armazenados com segurança e usados apenas para verificação.
      </p>
    </div>
  );
}
