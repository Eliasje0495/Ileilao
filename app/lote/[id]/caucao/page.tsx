"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

interface LotInfo { id: string; title: string; startPrice: number; auction: { title: string } }

function CheckoutForm({ lotId, onSuccess }: { lotId: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(""); setLoading(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/lote/${lotId}?caucao=ok` },
    });

    setLoading(false);
    if (stripeError) setError(stripeError.message ?? "Erro no pagamento.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
        {loading ? "Processando..." : "Pagar caução"}
      </button>
    </form>
  );
}

export default function CaucaoPage() {
  const { id: lotId } = useParams<{ id: string }>();
  const router = useRouter();
  const [lot, setLot] = useState<LotInfo | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [caucaoAmount, setCaucaoAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/lots/${lotId}`).then(r => r.json()).then(d => {
      if (d.lot) setLot(d.lot);
    });

    fetch("/api/caucao/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId }),
    }).then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); return; }
      setClientSecret(d.clientSecret);
      setCaucaoAmount(d.amount);
    });
  }, [lotId]);

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Não foi possível iniciar</h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Link href={`/lote/${lotId}`} className="text-sm text-blue-600 hover:underline">← Voltar ao lote</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href={`/lote/${lotId}`} className="text-sm text-gray-500 hover:text-blue-600">← Voltar</Link>
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600">i</span>
            <span className="text-2xl font-black text-gray-900">Leilão</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 w-full max-w-md p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Depósito de caução</h1>
          {lot && (
            <p className="text-sm text-gray-500 mb-6">{lot.title}</p>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Valor da caução</span>
              <span className="font-bold text-gray-900">
                {caucaoAmount > 0 ? `R$ ${caucaoAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Calculando..."}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              A caução é devolvida automaticamente caso você não vença o leilão. Em caso de arrematação, é descontada do valor final.
            </p>
          </div>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
              <CheckoutForm lotId={lotId} onSuccess={() => router.push(`/lote/${lotId}?caucao=ok`)} />
            </Elements>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">Carregando pagamento...</div>
          )}
        </div>
      </div>
    </div>
  );
}
