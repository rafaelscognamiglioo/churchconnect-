"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, ChevronRight } from "lucide-react";

const stats = [
  { value: "2.400+", label: "Igrejas ativas" },
  { value: "180K+", label: "Membros cadastrados" },
  { value: "94K+", label: "Eventos realizados" },
  { value: "99.9%", label: "Uptime garantido" },
];

const partners = [
  "Igreja Lagoinha", "Hillsong Brasil", "AD Vitória", "Renascer", "IBL", "Comunidade da Graça"
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] animate-pulse-slow [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8"
        >
          <Star className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
          <span>A plataforma #1 para igrejas no Brasil</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-poppins text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">O hub completo para</span>
          <br />
          <span className="text-gradient">conectar sua igreja.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
        >
          Gerencie eventos, membros e experiências da sua igreja
          <br className="hidden sm:block" />
          em um único lugar. Simples, moderno e poderoso.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/igrejas/cadastro"
            className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600" />
            <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <span className="relative flex items-center gap-2">
              Começar agora — grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link href="/como-funciona" className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white/80 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <Play className="w-3 h-3 fill-white text-white ml-0.5" />
            </div>
            Ver demonstração
          </Link>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white/40 text-sm mb-16"
        >
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#080812] bg-gradient-to-br from-violet-400 to-purple-600"
                style={{ backgroundPosition: `${i * 20}% 50%` }}
              />
            ))}
          </div>
          <span>Mais de <strong className="text-white/70">2.400 igrejas</strong> já confiam no ChurchConnect</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span>4.9/5</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mb-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black font-poppins text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-glass-dark">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 h-6 bg-white/5 rounded-md mx-8 flex items-center justify-center">
                <span className="text-xs text-white/30">app.churchconnect.com.br/dashboard</span>
              </div>
            </div>

            {/* Dashboard content mockup */}
            <DashboardMockup />
          </div>

          {/* Floating glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-violet-600/20 blur-[60px] rounded-full" />
        </motion.div>
      </div>

      {/* Partners strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10 w-full mt-24 py-8 border-t border-white/5"
      >
        <p className="text-center text-sm text-white/30 mb-6 uppercase tracking-widest font-medium">
          Igrejas que já usam o ChurchConnect
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
          {partners.map((p) => (
            <span key={p} className="text-white/25 font-semibold text-sm hover:text-white/50 transition-colors cursor-default">
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="bg-[#0d0d1f] p-5 min-h-[380px]">
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="hidden sm:block w-48 shrink-0">
          <div className="space-y-1">
            {["Dashboard", "Eventos", "Membros", "Check-in", "Analytics", "Configurações"].map((item, i) => (
              <div
                key={item}
                className={`h-8 rounded-lg flex items-center px-3 ${i === 0 ? "bg-violet-600/30 border border-violet-500/20" : "hover:bg-white/5"}`}
              >
                <div className={`h-2 rounded w-${[16, 12, 14, 10, 12, 14][i]} bg-${i === 0 ? "violet-400/70" : "white/15"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Membros", val: "1.248", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/20" },
              { label: "Eventos ativos", val: "12", color: "from-blue-500/20 to-cyan-600/20", border: "border-blue-500/20" },
              { label: "Check-ins hoje", val: "347", color: "from-green-500/20 to-emerald-600/20", border: "border-green-500/20" },
              { label: "Crescimento", val: "+18%", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/20" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-3 bg-gradient-to-br ${s.color} border ${s.border}`}>
                <div className="text-[10px] text-white/50 mb-1">{s.label}</div>
                <div className="text-lg font-bold text-white font-poppins">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="rounded-xl bg-white/3 border border-white/5 p-3 h-28 flex items-end gap-1.5">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{
                height: `${h}%`,
                background: i === 10 ? "linear-gradient(to top, #7c3aed, #a78bfa)" : "rgba(139,92,246,0.2)"
              }} />
            ))}
          </div>

          {/* Events list */}
          <div className="space-y-2">
            {[
              { title: "Conferência de Jovens 2025", date: "25 Jul", count: "234", color: "bg-pink-500/20 text-pink-400" },
              { title: "Retiro Espiritual", date: "02 Ago", count: "89", color: "bg-violet-500/20 text-violet-400" },
            ].map((ev) => (
              <div key={ev.title} className="flex items-center justify-between rounded-xl bg-white/3 border border-white/5 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ev.color}`}>{ev.date}</div>
                  <span className="text-xs text-white/70">{ev.title}</span>
                </div>
                <span className="text-xs text-white/40">{ev.count} inscritos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
