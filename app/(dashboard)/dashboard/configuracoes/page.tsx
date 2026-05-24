"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Building2, Bell, Shield, CreditCard,
  Upload, Save, CheckCircle2, Zap, Crown, Loader2, X,
  ImageIcon, Link2, Camera
} from "lucide-react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const NOTIF_DEFAULTS = [
  { key: "new_registration", label: "Nova inscrição", desc: "Quando alguém se inscreve em um evento" },
  { key: "new_member", label: "Novo membro", desc: "Quando um novo membro entra" },
  { key: "weekly_report", label: "Relatório semanal", desc: "Resumo toda segunda-feira" },
  { key: "event_full", label: "Evento lotado", desc: "Quando atinge 90% da capacidade" },
  { key: "event_reminder", label: "Lembretes de eventos", desc: "24h antes do início" },
];

function NotificationsTab() {
  const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("notif_prefs") || "{}") : {};
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    new_registration: true, new_member: true, weekly_report: true, event_full: true, event_reminder: false,
    ...stored,
  });

  function toggle(key: string) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    localStorage.setItem("notif_prefs", JSON.stringify(next));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-poppins text-lg font-bold text-white mb-0.5">Notificações</h2>
        <p className="text-sm text-white/40">Escolha quais alertas deseja receber</p>
      </div>
      {NOTIF_DEFAULTS.map((n) => (
        <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div>
            <p className="text-sm font-semibold text-white">{n.label}</p>
            <p className="text-xs text-white/40 mt-0.5">{n.desc}</p>
          </div>
          <button
            onClick={() => toggle(n.key)}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${prefs[n.key] ? "bg-violet-600" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${prefs[n.key] ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function SecurityTab() {
  const supabase = createSupabaseBrowserClient();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "As senhas não coincidem." });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwSaving(false);
    if (error) {
      setPwMsg({ type: "error", text: error.message });
    } else {
      setPwMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setPwForm({ current: "", next: "", confirm: "" });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-poppins text-lg font-bold text-white mb-0.5">Segurança</h2>
        <p className="text-sm text-white/40">Gerencie sua senha e acesso à conta</p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
        <h3 className="text-sm font-semibold text-white">Alterar senha</h3>
        {[
          { label: "Nova senha", key: "next", placeholder: "Mínimo 6 caracteres" },
          { label: "Confirmar nova senha", key: "confirm", placeholder: "Repita a nova senha" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">{f.label}</label>
            <input
              type="password"
              placeholder={f.placeholder}
              value={(pwForm as any)[f.key]}
              onChange={(e) => setPwForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
            />
          </div>
        ))}
        {pwMsg && (
          <div className={`px-4 py-3 rounded-xl text-sm ${pwMsg.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
            {pwMsg.text}
          </div>
        )}
        <button
          type="submit"
          disabled={pwSaving || !pwForm.next || !pwForm.confirm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-bold text-white transition-all disabled:opacity-50"
        >
          {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {pwSaving ? "Salvando..." : "Alterar senha"}
        </button>
      </form>

      <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
        <h3 className="text-sm font-semibold text-red-400 mb-1">Zona de risco</h3>
        <p className="text-xs text-white/40 mb-4">Ações irreversíveis. Proceda com cuidado.</p>
        <button
          onClick={() => alert("Para excluir sua conta, entre em contato com o suporte.")}
          className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
        >
          Excluir conta
        </button>
      </div>
    </div>
  );
}

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
  slug: string;
  logo_url: string | null;
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
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState<Partial<ChurchData>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("churches")
        .select("id, name, slug, logo_url, pastor_name, city, state, email, phone, website, instagram, description, plan")
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

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    let logoUrl = form.logo_url || null;

    // Upload logo if a new file was selected
    if (logoFile && church) {
      setUploadingLogo(true);
      const ext = logoFile.name.split(".").pop();
      const path = `${church.id}/logo-${Date.now()}.${ext}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("church-assets")
        .upload(path, logoFile, { upsert: true });
      setUploadingLogo(false);
      if (uploadError) {
        setSaveError(`Erro ao enviar logo: ${uploadError.message}`);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("church-assets").getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    let error;
    if (church) {
      // UPDATE existing
      ({ error } = await supabase.from("churches").update({
        name: form.name,
        slug: form.slug,
        logo_url: logoUrl,
        pastor_name: form.pastor_name,
        city: form.city,
        state: form.state,
        email: form.email,
        phone: form.phone,
        website: form.website,
        instagram: form.instagram,
        description: form.description,
      }).eq("id", church.id));
    } else {
      // INSERT new church if it doesn't exist yet
      const slug = (form.name || "minha-igreja")
        .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")
        + "-" + Date.now();
      const { data: newChurch, error: insertError } = await supabase.from("churches").insert({
        owner_id: user.id,
        name: form.name || "Minha Igreja",
        slug,
        pastor_name: form.pastor_name || null,
        city: form.city || null,
        state: form.state || null,
        email: form.email || null,
        phone: form.phone || null,
        website: form.website || null,
        instagram: form.instagram || null,
        description: form.description || null,
        plan: "starter",
        verified: false,
      }).select().single();
      error = insertError;
      if (newChurch) setChurch(newChurch as ChurchData);
    }

    setSaving(false);
    if (error) {
      setSaveError(`Erro ao salvar: ${error.message}`);
    } else {
      setChurch((c) => c ? { ...c, ...form, logo_url: logoUrl } as ChurchData : c);
      setForm((f) => ({ ...f, logo_url: logoUrl }));
      setLogoFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
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
                  {/* Logo upload */}
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {logoPreview || form.logo_url ? (
                          <img
                            src={logoPreview || form.logo_url!}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-white/20" />
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Logo da Igreja</p>
                      <p className="text-xs text-white/40 mt-0.5">JPG, PNG ou WebP · Máx. 2MB</p>
                      <label className="mt-2 inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        {logoFile ? logoFile.name : "Escolher arquivo"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      </label>
                    </div>
                  </div>

                  {/* Slug / URL personalizada */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <label className="block text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" /> URL pública da Igreja
                    </label>
                    <div className="flex items-center gap-0">
                      <span className="px-3 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-xs text-white/40 whitespace-nowrap">
                        churchconnect.vercel.app/igrejas/
                      </span>
                      <input
                        type="text"
                        value={form.slug || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                        placeholder="minha-igreja"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-r-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                      />
                    </div>
                    <p className="text-xs text-white/30 mt-1.5">Apenas letras minúsculas, números e hífens</p>
                  </div>

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
                  {saveError && (
                    <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {saveError}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white disabled:opacity-60">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {uploadingLogo ? "Enviando logo..." : saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
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
            <NotificationsTab />
          )}

          {activeTab === "security" && (
            <SecurityTab />
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
