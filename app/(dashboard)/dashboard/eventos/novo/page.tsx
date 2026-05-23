"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, Globe, DollarSign, Save, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "culto", label: "Culto" },
  { value: "celula", label: "Célula" },
  { value: "conferencia", label: "Conferência" },
  { value: "congresso", label: "Congresso" },
  { value: "retiro", label: "Retiro" },
  { value: "imersao", label: "Imersão" },
  { value: "jovens", label: "Jovens" },
  { value: "acampamento", label: "Acampamento" },
  { value: "encontro", label: "Encontro" },
  { value: "curso", label: "Curso" },
  { value: "escola_biblica", label: "Escola Bíblica" },
  { value: "batismo", label: "Batismo" },
  { value: "vigilia", label: "Vigília" },
  { value: "especial", label: "Especial" },
  { value: "outro", label: "Outro" },
];

export default function NovoEventoPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "culto",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    address: "",
    is_online: false,
    meeting_url: "",
    capacity: "",
    is_free: true,
    price: "",
    description: "",
    requires_checkin: true,
    status: "published",
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Get church
    const { data: church } = await supabase
      .from("churches")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!church) {
      setError("Igreja não encontrada. Complete o cadastro primeiro.");
      setLoading(false);
      return;
    }

    const slug = `${form.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-")}-${Date.now()}`;

    const { error: insertError } = await supabase.from("events").insert({
      church_id: church.id,
      title: form.title,
      slug,
      category: form.category,
      start_date: form.start_date,
      end_date: form.end_date || null,
      start_time: form.start_time,
      end_time: form.end_time || null,
      location: form.location || null,
      address: form.address || null,
      is_online: form.is_online,
      meeting_url: form.meeting_url || null,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      is_free: form.is_free,
      price: !form.is_free && form.price ? parseFloat(form.price) : null,
      description: form.description || null,
      requires_checkin: form.requires_checkin,
      status: form.status,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard/eventos"), 1500);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="font-poppins text-xl font-bold text-white mb-2">Evento criado!</h2>
          <p className="text-white/50 text-sm">Redirecionando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/eventos" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </Link>
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Novo Evento</h1>
          <p className="text-white/50 text-sm">Crie um novo evento para sua comunidade</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Informações básicas</h2>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Título do evento *</label>
            <input required type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Culto de Domingo"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              <Tag className="w-3.5 h-3.5 inline mr-1" />Categoria *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} type="button" onClick={() => set("category", cat.value)}
                  className={cn("py-2 px-3 rounded-xl border text-xs font-medium transition-all",
                    form.category === cat.value
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                  )}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Descrição</label>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Descreva o evento para os participantes..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all resize-none" />
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />Data e Hora
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Data início *</label>
              <input required type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Hora início *</label>
              <input required type="time" value={form.start_time} onChange={(e) => set("start_time", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Data fim</label>
              <input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Hora fim</label>
              <input type="time" value={form.end_time} onChange={(e) => set("end_time", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />Local
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("is_online", !form.is_online)}
              className={cn("w-10 h-5 rounded-full transition-colors relative", form.is_online ? "bg-violet-600" : "bg-white/10")}
            >
              <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", form.is_online ? "translate-x-5" : "translate-x-0.5")} />
            </div>
            <span className="text-sm text-white/70 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />Evento online
            </span>
          </label>

          {form.is_online ? (
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Link da reunião</label>
              <input type="url" value={form.meeting_url} onChange={(e) => set("meeting_url", e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Nome do local</label>
                <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
                  placeholder="Ex: Templo Principal"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Endereço</label>
                <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
              </div>
            </>
          )}
        </div>

        {/* Capacity & Price */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Vagas e Valor</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />Capacidade máxima
              </label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)}
                placeholder="Sem limite"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Valor</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.is_free} onChange={() => set("is_free", true)} className="accent-violet-500" />
                  <span className="text-sm text-white/70">Gratuito</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!form.is_free} onChange={() => set("is_free", false)} className="accent-violet-500" />
                  <span className="text-sm text-white/70">Pago</span>
                </label>
              </div>
            </div>
          </div>
          {!form.is_free && (
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />Preço (R$)
              </label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all" />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Configurações</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-white/70">Exigir check-in presencial</span>
            <div
              onClick={() => set("requires_checkin", !form.requires_checkin)}
              className={cn("w-10 h-5 rounded-full transition-colors relative", form.requires_checkin ? "bg-violet-600" : "bg-white/10")}
            >
              <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", form.requires_checkin ? "translate-x-5" : "translate-x-0.5")} />
            </div>
          </label>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 focus:outline-none focus:border-violet-500/50 text-sm transition-all">
              <option value="draft" className="bg-[#0d0d1f]">Rascunho</option>
              <option value="published" className="bg-[#0d0d1f]">Publicado</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <Link href="/dashboard/eventos"
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium text-center transition-all">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="flex-1 relative py-3 rounded-xl text-sm font-bold text-white overflow-hidden disabled:opacity-60">
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Criar Evento</>}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
