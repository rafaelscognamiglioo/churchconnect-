"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Calendar, MapPin, Users, Clock,
  MoreHorizontal, Eye, Edit, Trash2, QrCode, Share2
} from "lucide-react";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/types";

const mockEvents = [
  {
    id: "1", title: "Culto de Celebração", category: "culto" as EventCategory,
    date: "25/05/2025", time: "18:00", location: "Sede Central",
    registered: 248, capacity: 400, status: "published",
    banner: "from-violet-600 to-purple-700",
  },
  {
    id: "2", title: "Conferência de Jovens 2025", category: "jovens" as EventCategory,
    date: "01/06/2025", time: "09:00", location: "Ginásio Municipal",
    registered: 312, capacity: 500, status: "published",
    banner: "from-pink-600 to-rose-700",
  },
  {
    id: "3", title: "Retiro Espiritual — Família", category: "retiro" as EventCategory,
    date: "14/06/2025", time: "08:00", location: "Sítio Esperança",
    registered: 89, capacity: 150, status: "published",
    banner: "from-amber-600 to-orange-700",
  },
  {
    id: "4", title: "Escola Bíblica Avançada", category: "escola-biblica" as EventCategory,
    date: "20/06/2025", time: "19:30", location: "Sala A",
    registered: 34, capacity: 50, status: "published",
    banner: "from-teal-600 to-cyan-700",
  },
  {
    id: "5", title: "Vigília de Adoração", category: "vigilia" as EventCategory,
    date: "28/06/2025", time: "22:00", location: "Sede Central",
    registered: 0, capacity: 300, status: "draft",
    banner: "from-indigo-600 to-violet-700",
  },
  {
    id: "6", title: "Batismo nas Águas", category: "batismo" as EventCategory,
    date: "05/07/2025", time: "10:00", location: "Praia de Pernambuco",
    registered: 18, capacity: 50, status: "published",
    banner: "from-sky-600 to-blue-700",
  },
];

const statusLabel: Record<string, { label: string; color: string }> = {
  published: { label: "Publicado", color: "bg-green-500/20 text-green-400 border-green-500/20" },
  draft: { label: "Rascunho", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/20" },
  finished: { label: "Finalizado", color: "bg-white/10 text-white/40 border-white/10" },
};

export default function EventosPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockEvents.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Eventos</h1>
          <p className="text-white/50 text-sm mt-0.5">{mockEvents.length} eventos cadastrados</p>
        </div>
        <Link
          href="/dashboard/eventos/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white shadow-lg shadow-violet-500/25"
        >
          <Plus className="w-4 h-4" />
          Novo Evento
        </Link>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 flex-wrap"
      >
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

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white/70">
          <Filter className="w-4 h-4" />
          Filtrar
        </button>

        <div className="flex items-center gap-2">
          {["Todos", "Publicado", "Rascunho"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "Todos"
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((event, i) => {
          const cat = EVENT_CATEGORIES[event.category];
          const status = statusLabel[event.status];
          const pct = Math.round((event.registered / event.capacity) * 100);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Banner */}
              <div className={`h-24 bg-gradient-to-br ${event.banner} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-lg">{cat.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm`}>
                    {cat.label}
                  </span>
                </div>
                <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                  {status.label}
                </div>

                {/* Action menu */}
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
                        {[
                          { icon: Eye, label: "Visualizar" },
                          { icon: Edit, label: "Editar" },
                          { icon: QrCode, label: "QR Code" },
                          { icon: Share2, label: "Compartilhar" },
                          { icon: Trash2, label: "Excluir", danger: true },
                        ].map(({ icon: Icon, label, danger }) => (
                          <button
                            key={label}
                            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${danger ? "text-red-400" : "text-white/70"}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-poppins font-bold text-white mb-2 leading-tight">{event.title}</h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {event.date} às {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {event.location}
                  </div>
                </div>

                {/* Capacity progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.registered} inscritos</span>
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

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/eventos/${event.id}`}
                    className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/[0.07]"
                  >
                    Gerenciar
                  </Link>
                  <button className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 transition-all border border-violet-500/20">
                    Check-in
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
