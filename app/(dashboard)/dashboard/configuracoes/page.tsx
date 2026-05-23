"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Building2, Bell, Shield, CreditCard, Users, Globe,
  Upload, Save, CheckCircle2, Zap, Crown, Loader2, X
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const tabs = [
  { id: "church", label: "Igreja", icon: Building2 },
  { id: "billing", label: "Plano", icon: CreditCard },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Shield },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    description: "Para igrejas que estão começando",
    color: "border-white/10",
    badge: "",
    features: ["Até 50 membros", "3 eventos/mês", "Check-in manual", "Dashboard básico"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 97,
    description: "Para comunidades em crescimento",
    color: "border-blue-500/30",
    badge: "Mais popular",
    features: ["Até 300 membros", "20 eventos/mês", "QR Code check-in", "Analytics completo", "Comunicados push"],
  },
  {
    id: "revival",
    name: "Revival",
    price: 197,
    description: "Para igrejas estabelecidas",
    color: "border-violet-500/30",
    badge: "Recomendado",
    features: ["Membros ilimitados", "Eventos ilimitados", "QR Code check-in", "Analytics avançado", "Comunicados push + email", "Página pública personalizada"],
  },
  {
    id: "legacy",
    name: "Legacy",
    price: 397,
    description: "Para redes e denominações",
    color: "border-amber-500/30",
    badge: "Enterprise",
    features: ["Multi-igrejas", "Tudo do Revival", "API access", "Suporte prioritário", "Onboarding personalizado", "Relatórios executivos"],
  },
];

type ChurchData = {
  id: string;
  name: string;
  pastor_name: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  description: string | null;
  plan: string;
};

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("church");
  const [church, setChurch] = useState<ChurchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [form, setForm] = useState<Partial<ChurchData>>({});

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("churches")
        .select("id, name, pastor_name, city, state, email, phone, website, instagram, description, plan")
        .eq("owner_id", user.id)
        .single();
      if (data) {
        setChurch(data);
        setForm(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!church) return;
    setSaving(true);
    await supabase.from("churches").update({
      name: form.name,
      pastor_name: form.pastor_name,
      city: form.city,
      state: form.state,
      email: form.email,
      phone: form.phone,
      website: form.website,
      instagram: form.instagram,
      description: form.description,
    }).eq("id", church.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleUpgrade(planId: string) {
    if (!church || planId === church.plan) return;
    setUpgrading(true);
    // In production: redirect to Stripe Checkout here
    // window.location.href = `/api/checkout?plan=${planId}&church=${church.id}`
    await new Promise((r) => setTimeout(r, 1200));
    await supabase.from("churches").update({ plan: planId }).eq("id", church.id);
    setChurch((c) => c ? { ...c, plan: planId } : c);
    setUpgradePlan(null);
    setUpgrading(false);
  }

  const currentPlan = PLANS.find((p) => p.id === church?.plan) || PLANS[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-poppins text-2xl font-black text-white">Configurações</h1>
        <p className="text-white/50 text-sm mt-0.5">Gerencie as preferências da sua igreja</p>
      </motion.div>

      <div className="flex gap-6">
        <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="w-48 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </motion.nav>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex-1 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]">

          {/* Church Tab */}
          {activeTab === "church" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-poppins text-lg font-bold text-white mb-0.5">Informações da Igreja</h2>
                <p className="text-sm text-white/40">Atualize o perfil público da sua comunidade</p>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Nome da Igreja", key: "name", placeholder: "Igreja Graça Viva" },
                      { label: "Pastor(a)", key: "pastor_name", placeholder: "Pr. João Silva" },
                      { label: "Email", key: "email", placeholder: "contato@graca.com" },
                      { label: "Telefone", key: "phone", placeholder: "(11) 99999-9999" },
                      { label: "Cidade", key: "city", placeholder: "São Paulo" },
                      { label: "Estado", key: "state", placeholder: "SP" },
                      { label: "Website", key: "website", placeholder: "https://graca.com" },
                      { label: "Instagram", key: "instagram", placeholder: "@igrejagracaviva" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">{f.label}</label>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={(form as any)[f.key] || ""}
                          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Descrição</label>
                    <textarea
                      rows={4}
                      placeholder="Descreva sua comunidade..."
                      value={form.description || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white disabled:opacity-60">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-poppins text-lg font-bold text-white mb-0.5">Plano & Cobrança</h2>
                <p className="text-sm text-white/40">Gerencie sua assinatura da plataforma</p>
              </div>

              {/* Current plan */}
              {church && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider mb-1">Plano Atual</p>
                      <p className="text-2xl font-black font-poppins text-white">{currentPlan.name}</p>
                      <p className="text-sm text-white/50 mt-0.5">
                        {currentPlan.price === 0 ? "Gratuito" : `R$ ${currentPlan.price}/mês`}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      {currentPlan.id === "legacy" ? <Crown className="w-6 h-6 text-amber-400" /> : <Zap className="w-6 h-6 text-violet-400" />}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentPlan.features.map((f) => (
                      <span key={f} className="flex items-center gap-1 text-xs text-violet-300/80 bg-violet-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan grid */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Fazer upgrade</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANS.filter((p) => p.id !== church?.plan).map((plan) => (
                    <div key={plan.id} className={`p-4 rounded-2xl bg-white/[0.03] border ${plan.color} relative`}>
                      {plan.badge && (
                        <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                          {plan.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-poppins font-black text-white">{plan.name}</p>
                        <p className="text-sm font-bold text-white/70">
                          {plan.price === 0 ? "Grátis" : `R$ ${plan.price}/mês`}
                        </p>
                      </div>
                      <p className="text-xs text-white/40 mb-3">{plan.description}</p>
                      <ul className="space-y-1 mb-4">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-white/60">
                            <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setUpgradePlan(plan.id)}
                        className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold text-white/80 hover:text-white transition-all"
                      >
                        {plan.price === 0 ? "Fazer downgrade" : "Fazer upgrade"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-poppins text-lg font-bold text-white">Notificações</h2>
              {[
                { label: "Nova inscrição", desc: "Quando alguém se inscreve em um evento", on: true },
                { label: "Novo membro", desc: "Quando um novo membro entra", on: true },
                { label: "Relatório semanal", desc: "Resumo toda segunda-feira", on: true },
                { label: "Evento lotado", desc: "Quando atinge 90% da capacidade", on: true },
                { label: "Lembretes de eventos", desc: "24h antes do início", on: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-semibold text-white">{n.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{n.desc}</p>
                  </div>
                  <div className={`relative w-12 h-6 rounded-full cursor-pointer transition-all ${n.on ? "bg-violet-600" : "bg-white/10"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${n.on ? "left-6" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="text-center py-12">
              <Shield className="w-8 h-8 mx-auto mb-3 text-white/20" />
              <p className="text-white/40 text-sm">Configurações de segurança em breve</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Upgrade Confirm Modal */}
      <AnimatePresence>
        {upgradePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-bold text-white">
                  {PLANS.find((p) => p.id === upgradePlan)?.price === 0 ? "Confirmar downgrade" : "Confirmar upgrade"}
                </h3>
                <button onClick={() => setUpgradePlan(null)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {(() => {
                const plan = PLANS.find((p) => p.id === upgradePlan);
                return plan ? (
                  <>
                    <p className="text-white/60 text-sm mb-5">
                      Você vai {plan.price === 0 ? "fazer downgrade" : "fazer upgrade"} para o plano{" "}
                      <span className="text-white font-semibold">{plan.name}</span>{" "}
                      {plan.price > 0 ? `por R$ ${plan.price}/mês` : "(gratuito)"}.
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setUpgradePlan(null)}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm transition-all">
                        Cancelar
                      </button>
                      <button onClick={() => handleUpgrade(upgradePlan)} disabled={upgrading}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-bold text-white transition-all disabled:opacity-60">
                        {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
