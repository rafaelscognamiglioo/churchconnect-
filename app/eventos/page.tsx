"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Search, Filter, Calendar, MapPin, Users, Clock, Zap } from "lucide-react";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/types";

const mockPublicEvents = [
  {
    id: "1", title: "Conferência de Avivamento 2025", church: "Igreja Lagoinha", churchSlug: "lagoinha",
    category: "conferencia" as EventCategory, date: "28/06/2025", time: "09:00",
    location: "Centro de Convenções, BH", city: "Belo Horizonte, MG",
    registered: 1200, capacity: 2000, is_free: false, price: 80,
    banner: "from-violet-600 via-purple-700 to-indigo-800",
    description: "O maior evento de avivamento do Brasil. Três dias de imersão, pregações e adoração.",
  },
  {
    id: "2", title: "Youth Experience — Jovens sem Limites", church: "AD Vitória",
    category: "jovens" as EventCategory, date: "05/07/2025", time: "19:00",
    location: "Arena Carioca, RJ", city: "Rio de Janeiro, RJ",
    registered: 850, capacity: 1500, is_free: false, price: 60,
    banner: "from-pink-600 via-rose-700 to-red-800",
    description: "Uma noite épica para a juventude. Música, mensagem e muito mais.",
  },
  {
    id: "3", title: "Retiro do Espírito — Família 2025", church: "Comunidade da Graça",
    category: "retiro" as EventCategory, date: "12/07/2025", time: "18:00",
    location: "Sítio Esperança, SP", city: "Interior, SP",
    registered: 120, capacity: 200, is_free: false, price: 250,
    banner: "from-amber-600 via-orange-700 to-red-800",
    description: "Um final de semana de renovação espiritual para toda a família.",
  },
  {
    id: "4", title: "Escola Bíblica Online — Fundamentos da Fé", church: "IBL",
    category: "escola-biblica" as EventCategory, date: "14/07/2025", time: "19:30",
    location: "Online (Zoom)", city: "Brasil",
    registered: 340, capacity: 500, is_free: true, price: 0,
    banner: "from-teal-600 via-cyan-700 to-blue-800",
    description: "Curso online de 8 semanas sobre os fundamentos da fé cristã.",
  },
  {
    id: "5", title: "Acampamento de Verão JA 2025", church: "Renascer",
    category: "acampamento" as EventCategory, date: "18/07/2025", time: "16:00",
    location: "Chácara Bênção, Campinas", city: "Campinas, SP",
    registered: 280, capacity: 350, is_free: false, price: 180,
    banner: "from-lime-600 via-green-700 to-emerald-800",
    description: "O maior acampamento jovem do interior paulista. 4 dias de aventura e fé.",
  },
  {
    id: "6", title: "Culto de Vigília — 24 Horas de Oração", church: "Igreja Restauração",
    category: "vigilia" as EventCategory, date: "25/07/2025", time: "22:00",
    location: "Sede Central", city: "São Paulo, SP",
    registered: 180, capacity: 400, is_free: true, price: 0,
    banner: "from-indigo-600 via-violet-700 to-purple-800",
    description: "Uma noite de adoração contínua, intercessão e busca ao Senhor.",
  },
];

export default function EventosPublicPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = mockPublicEvents.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.church.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || e.category === selectedCategory;
    const matchFree = !freeOnly || e.is_free;
    return matchSearch && matchCat && matchFree;
  });

  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Eventos abertos
            </div>
            <h1 className="font-poppins text-5xl md:text-6xl font-black text-white mb-4">
              Descubra eventos
              <br />
              <span className="text-gradient">incríveis.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
              Conferências, retiros, acampamentos e muito mais.
              Encontre o próximo evento que transformará sua vida.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar eventos, igrejas, cidades..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 transition-all text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === "all" ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-white/50 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            Todos
          </button>
          {Object.entries(EVENT_CATEGORIES).slice(0, 8).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === key ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-white/50 hover:text-white bg-white/5 border border-white/10"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              freeOnly ? "bg-green-500/20 text-green-400 border border-green-500/20" : "text-white/50 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            ✓ Gratuitos
          </button>
        </div>
      </section>

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50 text-sm">{filtered.length} eventos encontrados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event, i) => {
            const cat = EVENT_CATEGORIES[event.category];
            const pct = Math.round((event.registered / event.capacity) * 100);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Banner */}
                <div className={`h-36 bg-gradient-to-br ${event.banner} relative flex items-end p-4`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.color} backdrop-blur-sm`}>
                      {cat.icon} {cat.label}
                    </span>
                    {event.is_free ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/30 text-green-300 backdrop-blur-sm border border-green-500/30">
                        Gratuito
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                        R$ {event.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-white/40 mb-1">{event.church}</p>
                  <h3 className="font-poppins font-bold text-white text-base mb-3 leading-tight line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {event.date} às {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.city}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      {event.registered} inscritos de {event.capacity}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-violet-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/30 mt-1">
                      {pct > 80 ? "Poucas vagas!" : pct > 50 ? "Vagas limitadas" : "Vagas disponíveis"}
                    </p>
                  </div>

                  <Link
                    href={`/eventos/${event.id}`}
                    className="block w-full py-2.5 text-sm font-bold text-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-white"
                  >
                    Ver detalhes e inscrever
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
