"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setError("Erro ao enviar e-mail. Verifique o endereço e tente novamente.");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-poppins font-bold text-lg">
            <span className="text-white">Church</span>
            <span className="text-gradient">Connect</span>
          </span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="font-poppins text-2xl font-black text-white mb-2">E-mail enviado!</h1>
            <p className="text-white/50 text-sm mb-6">
              Enviamos um link de redefinição para <span className="text-white font-medium">{email}</span>.
              Verifique sua caixa de entrada (e o spam).
            </p>
            <Link href="/login" className="flex items-center justify-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-poppins text-3xl font-black text-white mb-2">Esqueceu a senha?</h1>
            <p className="text-white/50 text-sm mb-8">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pastor@minhaigreja.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full relative py-3 rounded-xl text-sm font-bold text-white overflow-hidden disabled:opacity-60 transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {loading ? "Enviando..." : "Enviar link de redefinição"}
                </span>
              </button>
            </form>

            <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
