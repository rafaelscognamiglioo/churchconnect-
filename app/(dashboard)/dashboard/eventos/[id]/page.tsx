"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, MapPin, Users, Clock, Edit,
  Trash2, CheckCircle2, Globe, DollarSign, Loader2
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { EVENT_CATEGORIES } from "@/lib/types";

type Event = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  address: string | null;
  is_online: boolean;
  meeting_url: string | null;
  capacity: number | null;
  registered_count: number;
  is_free: boolean;
  price: number | null;
  status: string;
  requires_checkin: boolean;
};

const statusLabel: Record<string, { label: string; color: string }> = {
  published: { label: "Publicado", color: "bg-green-500/20 text-green-400 border-green-500/20" },
  draft: { label: "Rascunho", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/20" },
  finished: { label: "Finalizado", color: "bg-white/10 text-white/40 border-white/10" },
};

export default function EventoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("events").select("*").eq("id", id).single();
      setEvent(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    await supabase.from("events").delete().eq("id", id);
    router.push("/dashboard/eventos");
  }

  async function toggleStatus() {
    if (!event) return;
    setChangingStatus(true);
    const newStatus = event.status === "published" ? "draft" : "published";
    await supabase.from("events").update({ status: newStatus }).eq("id", id);
    setEvent((e) => e ? { ...e, status: newStatus } : e);
    setChangingStatus(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-white/30">
        <p className="text-sm">Evento não encontrado.</p>
        <Link href="/dashboard/eventos" className="mt-4 inline-flex items-center gap-2 text-violet-400 text-sm hover:text-violet-300">
          <ArrowLeft className="w-4 h-4" /> Voltar aos eventos
        </Link>
      </div>
    );
  }

  const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || { icon: "📅", label: event.category };
  const status = statusLabel[event.status] || statusLabel.draft;
  const date = new Date(event.start_date + "T00:00:00");
  const pct = event.capacity ? Math.round(((event.registered_count || 0) / event.capacity) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/eventos" className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-3 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-poppins text-2xl font-black text-white">{event.title}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>{status.label}</span>
          </div>
          <p className="text-white/40 text-sm mt-1">
            {cat.icon} {cat.label}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleStatus}
            disabled={changingStatus}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white/70 transition-all disabled:opacity-60"
          >
            {changingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {event.status === "published" ? "Despublicar" : "Publicar"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm text-red-400 transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Excluir
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3">
            {[
              { label: "Inscritos", value: event.registered_count || 0, icon: Users, color: "text-violet-400" },
              { label: "Capacidade", value: event.capacity || "∞", icon: Users, color: "text-blue-400" },
              { label: "Ocupação", value: event.capacity ? `${pct}%` : "—", icon: CheckCircle2, color: pct > 80 ? "text-red-400" : "text-green-400" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Capacity bar */}
          {event.capacity && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>{event.registered_count || 0} inscritos</span>
                <span>{event.capacity} vagas totais</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-violet-500"}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <h3 className="text-sm font-semibold text-white mb-3">Descrição</h3>
              <p className="text-sm text-white/60 leading-relaxed">{event.description}</p>
            </motion.div>
          )}
        </div>

        {/* Details sidebar */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4">
            <h3 className="text-sm font-semibold text-white">Detalhes</h3>

            <div className="flex items-start gap-3 text-sm text-white/60">
              <Calendar className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p>{date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                {event.start_time && <p className="text-white/40 text-xs mt-0.5">{event.start_time.slice(0, 5)}{event.end_time ? ` às ${event.end_time.slice(0, 5)}` : ""}</p>}
              </div>
            </div>

            {event.is_online ? (
              <div className="flex items-start gap-3 text-sm text-white/60">
                <Globe className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p>Online</p>
                  {event.meeting_url && <a href={event.meeting_url} target="_blank" rel="noopener noreferrer" className="text-violet-400 text-xs hover:text-violet-300">Acessar link →</a>}
                </div>
              </div>
            ) : event.location ? (
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p>{event.location}</p>
                  {event.address && <p className="text-white/40 text-xs mt-0.5">{event.address}</p>}
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3 text-sm text-white/60">
              <DollarSign className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{event.is_free ? "Gratuito" : `R$ ${event.price}`}</span>
            </div>

            {event.requires_checkin && (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Check-in ativado
              </div>
            )}
          </div>

          <Link
            href="/dashboard/checkin"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-bold text-white transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Fazer Check-in
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
