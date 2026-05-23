"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Building2, Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const steps = [
  { number: 1, label: "Sua conta" },
  { number: 2, label: "Sua Igreja" },
  { number: 3, label: "Plano" },
];

const UFS = ["SP","RJ","MG","RS","PR","SC","BA","CE","PE","GO","DF","AM","PA","ES","RN","PB","AL","SE","PI","MA","TO","RO","AC","AP","RR","MS","MT"];

export default function RegistroPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [account, setAccount] = useState({ name: "", email: "", phone: "", password: "" });
  const [church, setChurch] = useState({ name: "", city: "", state: "", pastor_name: "", description: "" });
  const [plan, setPlan] = useState("starter");

  const handleNext = () => { setError(""); setStep((s) => Math.min(s + 1, 3)); };
  const handlePrev = () => { setError(""); setStep((s) => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: { full_name: account.name, phone: account.phone },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Erro ao criar usuário.");
      setLoading(false);
      return;
    }

    // 2. Create church record
    const slug = church.name
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { error: churchError } = await supabase.from("churches").insert({
      owner_id: authData.user.id,
      name: church.name,
      slug: `${slug}-${Date.now()}`,
      city: church.city,
      state: church.state,
      pastor_name: church.pastor_name,
      description: church.description,
      plan,
      verified: false,
    });

    if (churchError) {
      setError("Conta criada! Mas houve um erro ao salvar a Igreja. Acesse o dashboard para completar.");
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center p-8">
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-poppins font-bold text-lg">
            <span className="text-white">Church</span>
            <span className="text-gradient">Connect</span>
          </span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === s.number
                  ? "bg-violet-600 text-white"
                  : step > s.number
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/5 text-white/40"
              }`}>
                {step > s.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{s.number}</span>}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-px transition-colors ${step > s.number ? "bg-green-500/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="font-poppins text-2xl font-black text-white mb-1">Crie sua conta</h1>
              <p className="text-white/50 text-sm mb-8">Seus dados de acesso ao ChurchConnect</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })}
                      placeholder="Pr. João Silva"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })}
                      placeholder="pastor@minhaigreka.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Telefone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="tel" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Church */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="font-poppins text-2xl font-black text-white mb-1">Sua Igreja</h1>
              <p className="text-white/50 text-sm mb-8">Informações da sua comunidade</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Nome da Igreja</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" value={church.name} onChange={(e) => setChurch({ ...church, name: e.target.value })}
                      placeholder="Igreja Comunidade da Graça"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Cidade</label>
                    <input type="text" value={church.city} onChange={(e) => setChurch({ ...church, city: e.target.value })}
                      placeholder="São Paulo"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Estado</label>
                    <select value={church.state} onChange={(e) => setChurch({ ...church, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 focus:outline-none focus:border-violet-500/50 transition-all text-sm">
                      <option value="">UF</option>
                      {UFS.map(uf => <option key={uf} value={uf} className="bg-[#0d0d1f]">{uf}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Nome do Pastor(a)</label>
                  <input type="text" value={church.pastor_name} onChange={(e) => setChurch({ ...church, pastor_name: e.target.value })}
                    placeholder="Pr. João Silva"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Descrição breve</label>
                  <textarea value={church.description} onChange={(e) => setChurch({ ...church, description: e.target.value })}
                    placeholder="Conte um pouco sobre sua comunidade..." rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm resize-none" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Plan */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="font-poppins text-2xl font-black text-white mb-1">Escolha seu plano</h1>
              <p className="text-white/50 text-sm mb-8">Comece grátis. Sem cartão de crédito.</p>
              <div className="space-y-3">
                {[
                  { key: "starter", name: "Starter", price: "Grátis", desc: "Até 50 membros, 5 eventos/mês", highlight: false },
                  { key: "growth", name: "Growth", price: "R$ 97/mês", desc: "Até 300 membros, 30 eventos/mês", highlight: false },
                  { key: "revival", name: "Revival", price: "R$ 197/mês", desc: "Até 1.000 membros, eventos ilimitados", highlight: true },
                ].map((p) => (
                  <label key={p.key} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    p.highlight ? "border-violet-500/40 bg-violet-500/10" : "border-white/10 bg-white/3 hover:border-white/20"
                  }`}>
                    <input type="radio" name="plan" value={p.key} checked={plan === p.key} onChange={() => setPlan(p.key)} className="accent-violet-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{p.name}</span>
                        {p.highlight && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600 text-white font-bold">POPULAR</span>}
                      </div>
                      <span className="text-xs text-white/40">{p.desc}</span>
                    </div>
                    <span className="font-bold text-white text-sm">{p.price}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={handlePrev}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-all text-sm font-medium">
                Voltar
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              className="flex-1 relative py-3 rounded-xl text-sm font-bold text-white overflow-hidden group disabled:opacity-60 transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 group-hover:from-violet-500 group-hover:to-purple-500 transition-all" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3 ? "Criar conta — Grátis" : "Continuar"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
