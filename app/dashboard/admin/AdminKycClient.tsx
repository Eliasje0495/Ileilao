"use client";

import { useState, useEffect } from "react";

interface KycDoc {
  id: string;
  type: string;
  url: string;
  createdAt: string;
}

interface PendingUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  kycDocuments: KycDoc[];
}

const DOC_LABELS: Record<string, string> = {
  CPF: "CPF",
  RG: "RG / CNH",
  COMPROVANTE: "Comprovante de residência",
  CNH: "CNH",
};

export default function AdminKycClient() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/kyc")
      .then(r => r.json())
      .then(d => { setUsers(d.users ?? []); setLoading(false); });
  }, []);

  async function handleAction(userId: string, action: "approve" | "reject") {
    setProcessing(userId);
    const res = await fetch("/api/admin/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    setProcessing(null);
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel Admin — KYC</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} verificações pendentes</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-gray-700">Nenhuma verificação pendente</p>
          <p className="text-sm text-gray-400 mt-1">Todas as solicitações foram processadas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")} · {user.kycDocuments.length} documento(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === user.id ? null : user.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {expanded === user.id ? "Ocultar docs" : "Ver docs"}
                  </button>
                  <button
                    onClick={() => handleAction(user.id, "reject")}
                    disabled={processing === user.id}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                  >
                    Reprovar
                  </button>
                  <button
                    onClick={() => handleAction(user.id, "approve")}
                    disabled={processing === user.id}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {processing === user.id ? "..." : "Aprovar"}
                  </button>
                </div>
              </div>

              {/* Documents */}
              {expanded === user.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  {user.kycDocuments.length === 0 ? (
                    <p className="text-sm text-gray-400">Nenhum documento enviado.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {user.kycDocuments.map(doc => (
                        <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="block bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition">
                          <p className="text-xs font-bold text-gray-700 mb-1">{DOC_LABELS[doc.type] ?? doc.type}</p>
                          <p className="text-xs text-blue-600 hover:underline truncate">{doc.url}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
