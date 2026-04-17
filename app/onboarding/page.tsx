"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const STEPS = ["Conta", "Dados Pessoais", "Endereço", "Selfie", "Documentos"];
const MIDIAS = ["Google / Buscador","Redes Sociais","Indicação de amigo","TV / Rádio","WhatsApp","E-mail marketing","Outro"];
const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1 ──
  const [username, setUsername] = useState("");
  const [referral, setReferral] = useState("");
  const [phone, setPhone] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsChannel, setSmsChannel] = useState<"sms"|"whatsapp">("sms");
  const [otpDigits, setOtpDigits] = useState(["","","","","",""]);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [acceptWhatsapp, setAcceptWhatsapp] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval>|null>(null);

  // ── Step 2 ──
  const [tipoCadastro, setTipoCadastro] = useState<"PF"|"PJ">("PF");
  // PF
  const [cpf, setCpf] = useState("");
  const [cpfStatus, setCpfStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");
  const [cpfError, setCpfError] = useState("");
  const [birthDate, setBirthDate] = useState("");
  // Nacionalidade
  const [isEstrangeiro, setIsEstrangeiro] = useState(false);
  const [nacionalidade, setNacionalidade] = useState("");
  const [rg, setRg] = useState("");
  const [telefoneFixo, setTelefoneFixo] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [profissao, setProfissao] = useState("");
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [modalCpf, setModalCpf] = useState("");
  const [modalCpfStatus, setModalCpfStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");
  const [modalCpfError, setModalCpfError] = useState("");
  // PJ
  const [cnpj, setCnpj] = useState("");
  const [cnpjStatus, setCnpjStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");
  const [cnpjError, setCnpjError] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [nomeSocio, setNomeSocio] = useState("");
  const [cpfSocio, setCpfSocio] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [telefoneComercial, setTelefoneComercial] = useState("");

  // ── Step 3 ──
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  // ── Formatters ──
  const fmt = {
    cpf: (v: string) => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2"),
    cnpj: (v: string) => v.replace(/\D/g,"").slice(0,14).replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1/$2").replace(/(\d{4})(\d{1,2})$/,"$1-$2"),
    phone: (v: string) => v.replace(/\D/g,"").slice(0,11).replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2"),
    tel: (v: string) => v.replace(/\D/g,"").slice(0,10).replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"),
  };

  // ── SMS/OTP helpers ──
  function startCountdown(secs = 120) {
    setCountdown(secs);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(v => { if (v <= 1) { clearInterval(countdownRef.current!); return 0; } return v - 1; });
    }, 1000);
  }

  async function sendOtp(channel: "sms"|"whatsapp") {
    setSendingOtp(true); setError(""); setSmsChannel(channel);
    const res = await fetch("/api/verify/phone/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, channel }),
    });
    const data = await res.json();
    setSendingOtp(false);
    if (!res.ok) { setError(data.error ?? "Erro ao enviar código."); return; }
    setSmsSent(true); setOtpDigits(["","","","","",""]); startCountdown(120);
  }

  function handleOtpChange(idx: number, value: string) {
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      const d = value.split(""); setOtpDigits(d); otpRefs.current[5]?.focus(); checkOtp(d.join("")); return;
    }
    const digit = value.replace(/\D/g,"").slice(-1);
    const next = [...otpDigits]; next[idx] = digit; setOtpDigits(next);
    if (digit && idx < 5) otpRefs.current[idx+1]?.focus();
    if (next.every(d => d !== "")) checkOtp(next.join(""));
  }

  function handleOtpKey(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) otpRefs.current[idx-1]?.focus();
  }

  async function checkOtp(code: string) {
    setVerifying(true); setError("");
    const res = await fetch("/api/verify/phone/check", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, channel: smsChannel }),
    });
    const data = await res.json();
    setVerifying(false);
    if (!res.ok) { setError(data.error ?? "Código inválido."); setOtpDigits(["","","","","",""]); otpRefs.current[0]?.focus(); return; }
    setPhoneVerified(true);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }

  // ── CPF/CNPJ validation ──
  async function validateCpf(raw: string) {
    setCpfStatus("checking"); setCpfError("");
    const res = await fetch("/api/validate/cpf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cpf: raw.replace(/\D/g,"") }) });
    const data = await res.json();
    if (data.valid) setCpfStatus("valid"); else { setCpfStatus("invalid"); setCpfError(data.error); }
  }

  async function validateModalCpf(raw: string) {
    setModalCpfStatus("checking"); setModalCpfError("");
    const res = await fetch("/api/validate/cpf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cpf: raw.replace(/\D/g,"") }) });
    const data = await res.json();
    if (data.valid) { setModalCpfStatus("valid"); setCpf(modalCpf); setCpfStatus("valid"); }
    else { setModalCpfStatus("invalid"); setModalCpfError(data.error); }
  }

  async function validateCnpj(raw: string) {
    setCnpjStatus("checking"); setCnpjError("");
    const res = await fetch("/api/validate/cnpj", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cnpj: raw }) });
    const data = await res.json();
    if (data.valid) {
      setCnpjStatus("valid");
      if (data.razaoSocial && !razaoSocial) setRazaoSocial(data.razaoSocial);
    } else { setCnpjStatus("invalid"); setCnpjError(data.error); }
  }

  // ── CEP lookup ──
  async function lookupCep(manual = false) {
    const clean = cep.replace(/\D/g,"");
    if (clean.length !== 8) { if (manual) setError("CEP inválido."); return; }
    setLoadingCep(true); setError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const d = await res.json();
      if (!d.erro) { setStreet(d.logradouro ?? ""); setNeighborhood(d.bairro ?? ""); setCity(d.localidade ?? ""); setUf(d.uf ?? ""); }
      else if (manual) setError("CEP não encontrado.");
    } catch { if (manual) setError("Erro ao buscar CEP."); }
    setLoadingCep(false);
  }

  async function advance(payload: Record<string, unknown>) {
    setError(""); setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, ...payload }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Erro."); return; }
    setStep(s => s + 1);
  }

  async function startStripeIdentity() {
    setError(""); setLoading(true);
    const res = await fetch("/api/identity/create", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Erro ao iniciar verificação."); return; }
    window.location.href = data.url;
  }

  const fmtCountdown = (s: number) => `${Math.floor(s/60)}m ${(s%60).toString().padStart(2,"0")}s`;

  // ── Input shared style ──
  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const inpSm = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600">i</span>
            <span className="text-2xl font-black text-gray-900">Leilão</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        {/* Progress */}
        <div className="w-full max-w-xl mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-blue-600 z-0 transition-all duration-500" style={{ width: `${((step-1)/(STEPS.length-1))*100}%` }} />
            {STEPS.map((label, i) => {
              const idx = i+1; const done = idx < step; const active = idx === step;
              return (
                <div key={label} className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-blue-600 border-blue-600" : active ? "bg-white border-blue-600" : "bg-white border-gray-300"}`}>
                    {done ? <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      : <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-blue-600" : "bg-gray-300"}`} />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${active ? "text-blue-700" : done ? "text-blue-500" : "text-gray-400"}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-xl p-8">
          {error && <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          {/* ══ STEP 1: Conta ══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={session?.user.email ?? ""} readOnly className={`${inp} bg-gray-50 text-gray-500 cursor-not-allowed`} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Usuário <span className="text-red-500">*</span></label>
                <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="Digite um apelido para seu usuário" className={inp} />
                <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres. Para sua privacidade e segurança, não utilize no usuário termos que possam identificá-lo.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Como conheceu nosso site? <span className="text-red-500">*</span></label>
                <select value={referral} onChange={e => setReferral(e.target.value)} className={`${inp} bg-white`}>
                  <option value="">[ Selecione Mídia ]</option>
                  {MIDIAS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Phone + OTP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone Celular <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input type="tel" value={phone} onChange={e => setPhone(fmt.phone(e.target.value))} placeholder="(99) 99999-9999"
                    disabled={phoneVerified}
                    className={`flex-1 ${inp} ${phoneVerified ? "bg-gray-50 text-gray-500" : ""}`} />
                  {!phoneVerified && (
                    countdown > 0
                      ? <div className="flex-shrink-0 border-2 border-gray-300 text-gray-500 font-semibold text-sm px-4 py-3 rounded-xl min-w-[100px] text-center">{fmtCountdown(countdown)}</div>
                      : (
                        <div className="flex gap-1">
                          <button type="button" onClick={() => sendOtp("sms")} disabled={sendingOtp || phone.replace(/\D/g,"").length < 10}
                            className="flex-shrink-0 border-2 border-blue-600 text-blue-600 font-semibold text-xs px-3 py-3 rounded-xl hover:bg-blue-50 transition disabled:opacity-40">
                            {sendingOtp ? "..." : "SMS"}
                          </button>
                          <button type="button" onClick={() => sendOtp("whatsapp")} disabled={sendingOtp || phone.replace(/\D/g,"").length < 10}
                            className="flex-shrink-0 border-2 border-green-600 text-green-600 font-semibold text-xs px-3 py-3 rounded-xl hover:bg-green-50 transition disabled:opacity-40">
                            {sendingOtp ? "..." : "WhatsApp"}
                          </button>
                        </div>
                      )
                  )}
                </div>

                {/* OTP Input */}
                {smsSent && !phoneVerified && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-3 text-center">
                      Código enviado via <strong>{smsChannel === "whatsapp" ? "WhatsApp" : "SMS"}</strong>. Digite abaixo:
                    </p>
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((d, i) => (
                        <input key={i} ref={el => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={6}
                          value={d}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKey(i, e)}
                          disabled={verifying}
                          className={`w-11 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition ${d ? "border-blue-500 text-blue-700" : "border-gray-200"} focus:border-blue-500`}
                          style={{ height: "3.25rem" }} />
                      ))}
                    </div>
                    {verifying && <p className="text-xs text-blue-500 text-center mt-2">Verificando...</p>}
                    {countdown > 0 && (
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Reenviar em {fmtCountdown(countdown)}
                      </p>
                    )}
                  </div>
                )}

                {/* Token validado */}
                {phoneVerified && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-green-600 text-sm font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Token validado!
                  </div>
                )}
              </div>

              {/* Checkboxes — only after phone verified */}
              {phoneVerified && (
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition ${acceptWhatsapp ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                      onClick={() => setAcceptWhatsapp(v => !v)}>
                      {acceptWhatsapp && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>}
                    </div>
                    <span className="text-sm text-gray-700 select-none" onClick={() => setAcceptWhatsapp(v => !v)}>
                      Aceito receber informações e ofertas da iLeilão pelo Whatsapp e SMS.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition ${acceptTerms ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                      onClick={() => setAcceptTerms(v => !v)}>
                      {acceptTerms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>}
                    </div>
                    <span className="text-sm text-gray-700 select-none" onClick={() => setAcceptTerms(v => !v)}>
                      Sim, declaro que tomei conhecimento dos{" "}
                      <Link href="/termos" className="text-blue-600 hover:underline">termos de uso</Link>{" "}e{" "}
                      <Link href="/privacidade" className="text-blue-600 hover:underline">política de privacidade</Link>, com os quais estou de acordo.
                    </span>
                  </label>
                </div>
              )}

              <button onClick={() => advance({ username, referralSource: referral, phone, acceptWhatsapp, acceptTerms })}
                disabled={loading || !phoneVerified || !acceptTerms}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Salvando..." : "Avançar"}
              </button>
            </div>
          )}

          {/* ══ STEP 2: Dados Pessoais ══ */}
          {step === 2 && (
            <div className="space-y-5">
              {/* PF / PJ toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Tipo de Cadastro</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["PF","PJ"] as const).map(tipo => (
                    <button key={tipo} type="button" onClick={() => setTipoCadastro(tipo)}
                      className={`py-3 rounded-xl border-2 font-semibold text-sm transition ${tipoCadastro === tipo ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tipoCadastro === tipo ? "border-blue-600" : "border-gray-300"}`}>
                          {tipoCadastro === tipo && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        {tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {tipoCadastro === "PF" && (
                <>
                  {/* Nacionalidade toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Nacionalidade</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([false, true] as const).map(estrang => (
                        <button key={String(estrang)} type="button" onClick={() => { setIsEstrangeiro(estrang); if (!estrang) { setNacionalidade(""); } }}
                          className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition ${isEstrangeiro === estrang ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isEstrangeiro === estrang ? "border-blue-600" : "border-gray-300"}`}>
                              {isEstrangeiro === estrang && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                            </div>
                            {estrang ? "Estrangeiro" : "Brasileira"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isEstrangeiro && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Informe a nacionalidade <span className="text-red-500">*</span></label>
                      <input value={nacionalidade} onChange={e => setNacionalidade(e.target.value)} placeholder="Ex: Portuguesa, Americana..." className={inp} />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CPF {!isEstrangeiro && <span className="text-red-500">*</span>}</label>
                    <div className="relative">
                      <input value={cpf} onChange={e => { setCpf(fmt.cpf(e.target.value)); setCpfStatus("idle"); }}
                        onBlur={() => { if (cpf.replace(/\D/g,"").length === 11) validateCpf(cpf); }}
                        placeholder="000.000.000-00" maxLength={14}
                        className={`${inp} pr-10 ${cpfStatus === "valid" ? "border-green-400" : cpfStatus === "invalid" ? "border-red-400" : ""}`} />
                      <div className="absolute right-3 top-3.5 text-sm">
                        {cpfStatus === "checking" && <span className="text-blue-400">...</span>}
                        {cpfStatus === "valid" && <span className="text-green-500 font-bold">✓</span>}
                        {cpfStatus === "invalid" && <span className="text-red-500 font-bold">✗</span>}
                      </div>
                    </div>
                    {cpfStatus === "invalid" && <p className="text-xs text-red-500 mt-1">{cpfError}</p>}
                    {cpfStatus === "valid" && <p className="text-xs text-green-600 mt-1">CPF válido.</p>}
                    {isEstrangeiro && <p className="text-xs text-gray-400 mt-1">Se você possui CPF, informe-o. Caso contrário, deixe em branco.</p>}
                  </div>

                  {isEstrangeiro && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">RG / Documento estrangeiro</label>
                      <input value={rg} onChange={e => setRg(e.target.value)} placeholder="Número do documento" className={inp} />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Data de nascimento <span className="text-red-500">*</span></label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inp} />
                  </div>

                  {isEstrangeiro && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Telefone fixo</label>
                        <input type="tel" value={telefoneFixo} onChange={e => setTelefoneFixo(fmt.tel(e.target.value))} placeholder="(11) 0000-0000" className={inpSm} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado civil</label>
                        <select value={estadoCivil} onChange={e => setEstadoCivil(e.target.value)} className={`${inpSm} bg-white`}>
                          <option value="">Selecione</option>
                          {["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {isEstrangeiro && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Profissão</label>
                      <input value={profissao} onChange={e => setProfissao(e.target.value)} placeholder="Sua profissão" className={inp} />
                    </div>
                  )}
                </>
              )}

              {tipoCadastro === "PJ" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CNPJ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input value={cnpj} onChange={e => { setCnpj(fmt.cnpj(e.target.value)); setCnpjStatus("idle"); }}
                        onBlur={() => { if (cnpj.replace(/\D/g,"").length === 14) validateCnpj(cnpj); }}
                        placeholder="00.000.000/0000-00" maxLength={18}
                        className={`${inp} pr-10 ${cnpjStatus === "valid" ? "border-green-400" : cnpjStatus === "invalid" ? "border-red-400" : ""}`} />
                      <div className="absolute right-3 top-3.5 text-sm">
                        {cnpjStatus === "checking" && <span className="text-blue-400">...</span>}
                        {cnpjStatus === "valid" && <span className="text-green-500 font-bold">✓</span>}
                        {cnpjStatus === "invalid" && <span className="text-red-500 font-bold">✗</span>}
                      </div>
                    </div>
                    {cnpjStatus === "invalid" && <p className="text-xs text-red-500 mt-1">{cnpjError}</p>}
                    {cnpjStatus === "valid" && <p className="text-xs text-green-600 mt-1">CNPJ válido.</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Razão Social <span className="text-red-500">*</span></label>
                    <input value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Inscrição estadual <span className="text-red-500">*</span></label>
                      <input value={inscricaoEstadual} onChange={e => setInscricaoEstadual(e.target.value)} className={inpSm} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Data de abertura <span className="text-red-500">*</span></label>
                      <input type="date" value={dataAbertura} onChange={e => setDataAbertura(e.target.value)} className={inpSm} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do sócio administrador <span className="text-red-500">*</span></label>
                    <input value={nomeSocio} onChange={e => setNomeSocio(e.target.value)} placeholder="Nome do sócio administrador" className={inp} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CPF do sócio <span className="text-red-500">*</span></label>
                    <input value={cpfSocio} onChange={e => setCpfSocio(fmt.cpf(e.target.value))} placeholder="000.000.000-00" maxLength={14} className={inp} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do contato na empresa <span className="text-red-500">*</span></label>
                    <input value={nomeContato} onChange={e => setNomeContato(e.target.value)} placeholder="Nome do contato" className={inp} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone Comercial</label>
                    <input type="tel" value={telefoneComercial} onChange={e => setTelefoneComercial(fmt.tel(e.target.value))} placeholder="(11) 0000-0000" className={inp} />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-400 transition">Voltar</button>
                <button
                  onClick={() => {
                    if (tipoCadastro === "PF") {
                      if (!isEstrangeiro && cpfStatus !== "valid") { setError("Valide o CPF antes de avançar."); return; }
                      if (isEstrangeiro && cpf.replace(/\D/g,"").length === 0) {
                        // Show modal to request CPF
                        setModalCpf(""); setModalCpfStatus("idle"); setModalCpfError(""); setShowCpfModal(true); return;
                      }
                      if (isEstrangeiro && cpf.replace(/\D/g,"").length > 0 && cpfStatus !== "valid") { setError("Valide o CPF antes de avançar."); return; }
                      advance({ tipoCadastro, cpf: cpf.replace(/\D/g,"") || undefined, birthDate, isEstrangeiro, nacionalidade: isEstrangeiro ? nacionalidade : undefined, rg: isEstrangeiro ? rg : undefined, telefoneFixo: isEstrangeiro ? telefoneFixo : undefined, estadoCivil: isEstrangeiro ? estadoCivil : undefined, profissao: isEstrangeiro ? profissao : undefined });
                    } else {
                      if (cnpjStatus !== "valid") { setError("Valide o CNPJ antes de avançar."); return; }
                      advance({ tipoCadastro, cnpj: cnpj.replace(/\D/g,""), razaoSocial, inscricaoEstadual, dataAbertura, nomeSocio, cpfSocio: cpfSocio.replace(/\D/g,""), nomeContato, telefoneComercial });
                    }
                  }}
                  disabled={loading || (tipoCadastro === "PF" ? (!isEstrangeiro && cpfStatus !== "valid") : cnpjStatus !== "valid")}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? "Salvando..." : "Avançar"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Endereço ══ */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">CEP <span className="text-red-500">*</span></label>
                <div className="flex gap-2 items-center">
                  <input value={cep} onChange={e => setCep(e.target.value.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2"))}
                    onKeyDown={e => { if (e.key === "Enter") lookupCep(true); }}
                    placeholder="Digite o cep" maxLength={9} className={`flex-1 ${inp}`} />
                  <button type="button" onClick={() => lookupCep(true)} disabled={loadingCep}
                    className="flex-shrink-0 bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                    {loadingCep ? "..." : "Buscar"}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rua / Logradouro <span className="text-red-500">*</span></label>
                  <input value={street} onChange={e => setStreet(e.target.value)} className={inpSm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Número <span className="text-red-500">*</span></label>
                  <input value={number} onChange={e => setNumber(e.target.value)} className={inpSm} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Complemento</label>
                <input value={complement} onChange={e => setComplement(e.target.value)} placeholder="Apto, bloco..." className={inpSm} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bairro <span className="text-red-500">*</span></label>
                <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className={inpSm} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cidade <span className="text-red-500">*</span></label>
                  <input value={city} onChange={e => setCity(e.target.value)} className={inpSm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">UF <span className="text-red-500">*</span></label>
                  <select value={uf} onChange={e => setUf(e.target.value)} className={`${inpSm} bg-white`}>
                    <option value="">UF</option>
                    {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-400 transition">Voltar</button>
                <button onClick={() => advance({ addressCep: cep, addressStreet: street, addressNumber: number, addressComplement: complement, addressNeighborhood: neighborhood, addressCity: city, addressUf: uf })} disabled={loading}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                  {loading ? "Salvando..." : "Avançar"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 4: Selfie ══ */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Foto de verificação (Selfie)</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Você será redirecionado para tirar uma <strong>selfie ao vivo</strong> para confirmar sua identidade.<br />Certifique-se de estar em um ambiente bem iluminado.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2">
                {["Câmera frontal do celular ou webcam","Rosto visível, sem óculos escuros ou chapéu","Selfie tirada ao vivo — não são aceitas fotos da galeria"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-700">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-400 transition">Voltar</button>
                <button onClick={startStripeIdentity} disabled={loading}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? "Iniciando..." : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                    Tirar selfie
                  </>}
                </button>
              </div>
              <p className="text-xs text-gray-400">Verificação segura pela <a href="https://stripe.com/identity" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Stripe Identity</a>.</p>
            </div>
          )}

          {/* ══ STEP 5: Documentos ══ */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Envio de documentos</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Agora envie as fotos do seu <strong>RG ou CNH</strong>.<br />Você será redirecionado para a verificação segura da Stripe.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2">
                {["Frente e verso do documento","Documento dentro do prazo de validade","Foto nítida, sem reflexos ou partes cortadas"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-700">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-400 transition">Voltar</button>
                <button onClick={startStripeIdentity} disabled={loading}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? "Iniciando..." : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    Enviar documentos
                  </>}
                </button>
              </div>
              <p className="text-xs text-gray-400">Verificação segura pela <a href="https://stripe.com/identity" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Stripe Identity</a>.</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ CPF Modal (Estrangeiro) ══ */}
      {showCpfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">CPF necessário para participar</h3>
              <p className="text-sm text-gray-500">Para participar de leilões no Brasil, estrangeiros precisam ter um CPF. Insira seu CPF para continuar.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <div className="relative">
                <input value={modalCpf}
                  onChange={e => { setModalCpf(fmt.cpf(e.target.value)); setModalCpfStatus("idle"); }}
                  onBlur={() => { if (modalCpf.replace(/\D/g,"").length === 11) validateModalCpf(modalCpf); }}
                  placeholder="000.000.000-00" maxLength={14}
                  className={`${inp} pr-10 ${modalCpfStatus === "valid" ? "border-green-400" : modalCpfStatus === "invalid" ? "border-red-400" : ""}`} />
                <div className="absolute right-3 top-3.5 text-sm">
                  {modalCpfStatus === "checking" && <span className="text-blue-400">...</span>}
                  {modalCpfStatus === "valid" && <span className="text-green-500 font-bold">✓</span>}
                  {modalCpfStatus === "invalid" && <span className="text-red-500 font-bold">✗</span>}
                </div>
              </div>
              {modalCpfStatus === "invalid" && <p className="text-xs text-red-500 mt-1">{modalCpfError}</p>}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => {
                  // Proceed without CPF
                  setShowCpfModal(false);
                  advance({ tipoCadastro, cpf: undefined, birthDate, isEstrangeiro, nacionalidade, rg, telefoneFixo, estadoCivil, profissao });
                }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition">
                Não possuo CPF
              </button>
              <button onClick={() => {
                  if (modalCpfStatus !== "valid") { if (modalCpf.replace(/\D/g,"").length === 11) validateModalCpf(modalCpf); return; }
                  setShowCpfModal(false);
                  advance({ tipoCadastro, cpf: modalCpf.replace(/\D/g,""), birthDate, isEstrangeiro, nacionalidade, rg, telefoneFixo, estadoCivil, profissao });
                }}
                disabled={modalCpfStatus === "checking"}
                className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-50">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
