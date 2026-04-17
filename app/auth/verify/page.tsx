"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  const maskedLocal = local[0] + local.slice(1).replace(/./g, "*").slice(0, -1) + local[local.length - 1];
  const domainParts = domain.split(".");
  const maskedDomain = domainParts[0][0] + "*".repeat(domainParts[0].length - 1);
  return `${maskedLocal}@${maskedDomain}.${domainParts.slice(1).join(".")}`;
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (code.length === 6) verify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function handleChange(idx: number, value: string) {
    // Allow paste of full code
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      const newDigits = value.split("");
      setDigits(newDigits);
      inputs.current[5]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = digit;
    setDigits(newDigits);
    if (digit && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  async function verify(c: string) {
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: c }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); setDigits(["","","","","",""]); inputs.current[0]?.focus(); return; }
    router.push(`/auth/bem-vindo?name=${encodeURIComponent(data.name ?? "")}`);
  }

  async function resendCode() {
    setResending(true); setError(""); setResent(false);
    await fetch("/api/auth/verify-email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false); setResent(true);
  }

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
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 w-full max-w-md p-8 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Verifique o código enviado para o seu e-mail</h1>
          {email && (
            <p className="text-sm text-gray-500 mb-6">
              Enviamos um código de seis caracteres para{" "}
              <span className="font-medium text-gray-700">{maskEmail(email)}</span>
            </p>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}
          {resent && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">Código reenviado!</div>
          )}

          {/* 6-digit input */}
          <div className="flex justify-center gap-2 mb-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={6}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={loading}
                className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition
                  ${d ? "border-blue-500 text-blue-700" : "border-gray-200 text-gray-900"}
                  ${loading ? "opacity-50" : ""}
                  focus:border-blue-500`}
                style={{ height: "3.25rem" }}
              />
            ))}
          </div>

          {loading && (
            <p className="text-sm text-blue-600 mb-4">Verificando...</p>
          )}

          {/* Gmail / Outlook shortcuts */}
          <div className="flex gap-3 justify-center mb-6">
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
              Abra o Gmail
            </a>
            <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.32.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.1V2.55q0-.44.3-.75.3-.3.75-.3h12.5q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3zm0 4.86L15.78 8.5l-.02-.01q-.06-.04-.13-.06-.06-.02-.13-.02H8.5V10h4.5l3 2v-3.4z"/>
              </svg>
              Abra o Outlook
            </a>
          </div>

          <button onClick={resendCode} disabled={resending}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50">
            {resending ? "Reenviando..." : "Não recebeu? Reenviar código"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
