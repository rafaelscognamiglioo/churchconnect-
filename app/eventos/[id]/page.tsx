"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import {
  Calendar, MapPin, Users, Clock, Share2, Heart,
  CheckCircle2, QrCode, ArrowLeft, Building2
} from "lucide-react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = {
    id,
    title: "Conferência de Avivamento 2025",
    church: "Igreja Lagoinha",
    churchSlug: "lagoinha",
    category: "conferencia",
    date: "28 de Junho de 2025",
    time: "09:00 às 22:00",
    location: "Centro de Convenções de BH",
    address: "Av. Amazonas, 1000 · Belo Horizonte, MG",
    registered: 1200,
    capacity: 2000,
    is_free: false,
    price: 80,
    banner: "from-violet-600 via-purple-700 to-indigo-800",
    description: `
      <p>O maior evento de avivamento do Brasil chega em 2025 com uma proposta épica: três dias de imersão total na presença de Deus.</p>
      <p>Com pregadores nacionais e internacionais, bandas de louvor renomadas e momentos poderosos de adoração, a Conferência de Avivamento 2025 será um marco histórico.</p>
      <h3>O que esperar:</h3>
      <ul>
        <li>12 sessões de pregação com líderes de todo o Brasil</li>
        <li>Adoração ao vivo com bandas nacionais</li>
        <li>Momentos de ministração e intercessão</li>
        <li>Arena de jovens e teen simultânea</li>
        <li>Transmissão ao vivo para todo o país</li>
      </ul>
    `,
    speakers: [
      { name: "Pr. Valdemiro Santiago", role: "Pregador Principal", avatar: "VS" },
      { name: "Pr. Lucinho Barreto", role: "Pregador Convidado", avatar: "LB" },
      { name: "Pr. André Valadão", role: "Adoração", avatar: "AV" },
    ],
    schedule: [
      { day: "Dia 1 - Sáb 28/06", time: "09:00", title: "Abertura e Adoração" },
      { day: "Dia 1 - Sáb 28/06", time: "10:30", title: "Mensagem: Pr. Valdemiro" },
      { day: "Dia 2 - Dom 29/06", time: "09:00", title: "Adoração Matinal" },
      { day: "Dia 2 - Dom 29/06", time: "11:00", title: "Mensagem: Pr. Lucinho" },
      { day: "Dia 3 - Seg 30/06", time: "19:00", title: "Noite de Fogo Final" },
    ],
  };

  const pct = Math.round((event.registered / event.capacity) * 100);

  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />

      {/* Banner */}
      <div className={`relative h-64 md:h-80 bg-gradient-to-br ${event.banner} mt-16`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <Link href="/eventos" className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos eventos
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              🎤 Conferência
            </span>
            {!event.is_free && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                R$ {event.price}
              </span>
            )}
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl font-black text-white leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Calendar, text: event.date },
                { icon: Clock, text: event.time },
                { icon: MapPin, text: event.location },
                { icon: Users, text: `${event.registered.toLocaleString()} inscritos` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">
                  <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* Church */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                IL
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{event.church}</p>
                <Link href={`/igrejas/${event.churchSlug}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Ver página da igreja →
                </Link>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-poppins text-xl font-bold text-white mb-4">Sobre o evento</h2>
              <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed space-y-4">
                <p>O maior evento de avivamento do Brasil chega em 2025 com uma proposta épica: três dias de imersão total na presença de Deus.</p>
                <p>Com pregadores nacionais e internacionais, bandas de louvor renomadas e momentos poderosos de adoração, a Conferência de Avivamento 2025 será um marco histórico.</p>
                <h3 className="text-white font-semibold mt-4">O que esperar:</h3>
                <ul className="space-y-2">
                  {["12 sessões de pregação com líderes de todo o Brasil", "Adoração ao vivo com bandas nacionais", "Momentos de ministração e intercessão", "Arena de jovens e teen simultânea", "Transmissão ao vivo para todo o país"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Speakers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-poppins text-xl font-bold text-white mb-4">Palestrantes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.speakers.map((sp) => (
                  <div key={sp.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-base font-bold text-white mx-auto mb-3">
                      {sp.avatar}
                    </div>
                    <p className="font-semibold text-white text-sm">{sp.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{sp.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="font-poppins text-xl font-bold text-white mb-4">Programação</h2>
              <div className="space-y-2">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs text-violet-400 font-semibold w-16 shrink-0">{item.time}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/40">{item.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Registration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="sticky top-24 space-y-4">
              {/* Registration card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.10]">
                <div className="mb-4">
                  {event.is_free ? (
                    <p className="text-3xl font-black font-poppins text-green-400">Gratuito</p>
                  ) : (
                    <div>
                      <p className="text-3xl font-black font-poppins text-white">R$ {event.price}</p>
                      <p className="text-sm text-white/40">por pessoa</p>
                    </div>
                  )}
                </div>

                {/* Capacity */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">{event.registered.toLocaleString()} inscritos</span>
                    <span className="text-white/50">{event.capacity.toLocaleString()} vagas</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-violet-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-white/30">{100 - pct}% das vagas disponíveis</p>
                </div>

                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-base font-bold text-white mb-3">
                  Inscrever-se agora
                </button>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm">
                    <Heart className="w-4 h-4" />
                    Salvar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <h3 className="font-semibold text-white text-sm mb-2">Local</h3>
                <div className="flex items-start gap-2 text-sm text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                  <div>
                    <p>{event.location}</p>
                    <p className="text-white/40 text-xs mt-0.5">{event.address}</p>
                    <a href="#" className="text-violet-400 text-xs hover:text-violet-300 transition-colors mt-1 block">
                      Ver no mapa →
                    </a>
                  </div>
                </div>
              </div>

              {/* Church card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    IL
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{event.church}</p>
                    <Link href={`/igrejas/${event.churchSlug}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      Ver todos os eventos →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
