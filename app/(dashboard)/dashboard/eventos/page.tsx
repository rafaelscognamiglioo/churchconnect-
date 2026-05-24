"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Calendar, MapPin, Users,
  MoreHorizontal, Eye, Trash2, Loader2
} from "lucide-react";
import { EVENT_CATEGORIES } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  title: string;
  category: string;
  start_date: string;
  start_time: string | null;
  location: string | null;
  registered_count: number;
  capacity: number | null;
  status: string;
};

const statusLabel: Record<string, { label: string; color: string }> = {
  published: { label: "Publicado", color: "bg-green-500/20 text-green-400 border-green-500/20" },
  draft: { label: "Rascunho", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/20" },
  finished: { label: "Finalizado", color: "bg-white/10 text-white/40 border-white/10" },
};

const BANNER_COLORS = [
  "from-violet-600 to-purple-700",
  "from-pink-600 to-rose-700",
  "from-amber-600 to-orange-700",
  "from-teal-600 to-cyan-700",
  "from-indigo-600 to-violet-700",
  "from-sky-600 to-blue-700",
];

const STATUS_FILTERS = ["Todos", "Publicado", "Rascunho", "Finalizado"];

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: church } = await supabase.from("churches").select("id").eq("owner_id", user.id).single();
    if (!church) { setLoading(false); return; }
    const { data } = await supabase
      .from("events")
      .select("id, title, category, start_date, start_time, location, registered_count, capacity, status")
      .eq("church_id", church.id)
      .order("start_date", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Publicado" && e.status === "published") ||
      (statusFilter === "Rascunho" && e.status === "draft") ||
      (statusFilter === "Finalizado" && e.status === "finished");
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    setDeleting(id);
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Eventos</h1>
          <p className="text-white/50 text-sm mt-0.5">
            {loading ? "Carregando..." : `${events.length} evento${events.length !== 1 ? "s" : ""} cadastrado${events.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/dashboard/eventos/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white shadow-lg shadow-violet-500/25"
        >
          <Plus className="w-4 h-4" />
          Novo Evento
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                statusFilter === f
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Events grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {events.length === 0 ? "Nenhum evento ainda. Crie o primeiro!" : "Nenhum evento encontrado"}
          </p>
          {events.length === 0 && (
            <Link href="/dashboard/eventos/novo" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 text-sm font-medium hover:bg-violet-600/30 transition-all">
              <Plus className="w-4 h-4" /> Criar evento
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((event, i) => {
            const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || { icon: "📅", label: event.category };
            const status = statusLabel[event.status] || statusLabel.draft;
            const registered = event.registered_count || 0;
            const capacity = event.capacity || 0;
            const pct = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
            const banner = BANNER_COLORS[i % BANNER_COLORS.length];
            const date = new Date(event.start_date + "T00:00:00");

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-24 bg-gradient-to-br ${banner} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm">
                      {cat.label}
                    </span>
                  </div>
                  <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                    {status.label}
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === event.id ? null : event.id)}
                        className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-white" />
                      </button>
                      {openMenu === event.id && (
                        <div className="absolute right-0 bottom-8 w-44 bg-[#0d0d1f] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10">
                          <Link href={`/dashboard/eventos/${event.id}`} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors">
                            <Eye className="w-3.5 h-3.5" /> Gerenciar
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={deleting === event.id}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors disabled:opacity-60"
                          >
                            {deleting === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-poppins font-bold text-white mb-2 leading-tight">{event.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {date.toLocaleDateString("pt-BR")} {event.start_time ? `às ${event.start_time.slice(0, 5)}` : ""}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  {capacity > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Users className="w-3.5 h-3.5" />
                          <span>{registered} inscritos</span>
                        </div>
                        <span className="text-xs text-white/40">{pct}% cheio</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-violet-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/dashboard/eventos/${event.id}`}
                      className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/[0.07]"
                    >
                      Gerenciar
                    </Link>
                    <Link
                      href="/dashboard/checkin"
                      className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 transition-all border border-violet-500/20"
                    >
                      Check-in
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
