"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Calendar, Users, QrCode, BarChart3, Bell,
  Shield, Smartphone, Zap, Globe, CheckCircle2, ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Gestão de Eventos",
    description: "Crie, divulgue e gerencie todos os eventos da sua igreja. Cultos, conferências, retiros, células e muito mais.",
    color: "from-violet-500 to-purple-600",
    glow: "violet",
    items: ["Cadastro completo", "Inscrição online", "Lista de presença", "Relatórios"],
  },
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Cadastro completo dos membros com histórico, perfil e acompanhamento de participações e crescimento.",
    color: "from-blue-500 to-cyan-600",
    glow: "blue",
    items: ["Perfil completo", "Histórico de eventos", "Grupos e células", "Acompanhamento"],
  },
  {
    icon: QrCode,
    title: "Check-in por QR Code",
    description: "Sistema inteligente de check-in via QR Code. Confirme presenças em segundos, sem filas e sem papel.",
    color: "from-green-500 to-emerald-600",
    glow: "green",
    items: ["QR Code único", "Check-in instantâneo", "Histórico em tempo real", "Anti-fraude"],
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Dashboards e relatórios completos sobre crescimento, engajamento e métricas da sua comunidade.",
    color: "from-amber-500 to-orange-600",
    glow: "amber",
    items: ["Gráficos interativos", "Relatórios mensais", "Métricas de crescimento", "Export PDF/Excel"],
  },
  {
    icon: Bell,
    title: "Comunicados",
    description: "Envie comunicados, lembretes e avisos por e-mail para todos os membros da sua comunidade.",
    color: "from-pink-500 to-rose-600",
    glow: "pink",
    items: ["E-mail em massa", "Lembrete 24h antes", "Segmentação por grupo", "Histórico de envios"],
  },
  {
    icon: Globe,
    title: "Página Institucional",
    description: "Cada igreja recebe sua mini landing page com identidade visual, eventos e informações completas.",
    color: "from-indigo-500 to-violet-600",
    glow: "indigo",
    items: ["URL personalizada", "Design customizável", "SEO otimizado", "Responsivo"],
  },
];

const bigFeatures = [
  {
    badge: "CHECK-IN INTELIGENTE",
    title: "Fim das filas na entrada. Bem-vindo ao futuro.",
    description: "Com o sistema de QR Code do ChurchConnect, cada participante recebe um código único por evento. Escaneie na entrada e confirme a presença em menos de 2 segundos.",
    color: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-500/20",
    items: [
      "QR Code gerado automaticamente",
      "Check-in via smartphone",
      "Lista atualizada em tempo real",
      "Relatório de presença automático",
    ],
    visual: <CheckinVisual />,
  },
  {
    badge: "ANALYTICS",
    title: "Tome decisões baseadas em dados reais.",
    description: "Entenda o crescimento da sua comunidade com métricas detalhadas. Veja quais eventos engajam mais, acompanhe a frequência dos membros e muito mais.",
    color: "from-blue-500/20 to-cyan-600/10",
    border: "border-blue-500/20",
    items: [
      "Crescimento de membros",
      "Engajamento por evento",
      "Frequência e assiduidade",
      "Relatórios exportáveis",
    ],
    visual: <AnalyticsVisual />,
    reverse: true,
  },
];

function CheckinVisual() {
  return (
    <div className="relative p-6 flex items-center justify-center">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-purple-700/20 rounded-3xl border border-violet-500/20 flex items-center justify-center">
          <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center">
            <div className="w-20 h-20 grid grid-cols-5 gap-0.5">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[1px] bg-[#080812]"
                  style={{ opacity: Math.random() > 0.4 ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Scan animation */}
        <motion.div
          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded"
          animate={{ top: ["20%", "80%", "20%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Check badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1, duration: 0.4 }}
          className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40"
        >
          <CheckCircle2 className="w-6 h-6 text-white" fill="white" />
        </motion.div>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [35, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100];
  return (
    <div className="p-6">
      <div className="space-y-2 mb-4">
        {[
          { label: "Membros ativos", val: 87, color: "bg-blue-500" },
          { label: "Presença média", val: 72, color: "bg-violet-500" },
          { label: "Novos este mês", val: 45, color: "bg-green-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-white/50 w-28">{item.label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.val}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${item.color} rounded-full`}
              />
            </div>
            <span className="text-xs text-white/70 w-8">{item.val}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-24">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="flex-1 rounded-t-sm"
            style={{ background: i === 11 ? "linear-gradient(to top, #3b82f6, #60a5fa)" : "rgba(59,130,246,0.2)" }}
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <>
      {/* Feature grid */}
      <section id="funcionalidades" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#080812]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Funcionalidades
            </div>
            <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Tudo que sua igreja precisa,
              <br />
              <span className="text-gradient">em um só lugar.</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Do cadastro de membros ao check-in inteligente. Do analytics aos comunicados por e-mail.
              O ChurchConnect é o ecossistema completo da sua comunidade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-white/[0.02] to-transparent" />

                  <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="font-poppins text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 mb-4 leading-relaxed">{feature.description}</p>

                  <ul className="space-y-1.5">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Big feature blocks */}
      {bigFeatures.map((feat, i) => (
        <section key={feat.badge} className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[#080812]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col ${feat.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}>
              <motion.div
                initial={{ opacity: 0, x: feat.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex-1"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wider mb-6">
                  {feat.badge}
                </div>
                <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  {feat.title}
                </h2>
                <p className="text-base text-white/50 mb-8 leading-relaxed">{feat.description}</p>
                <ul className="space-y-3 mb-8">
                  {feat.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/70">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:text-violet-300 transition-colors group">
                  Saiba mais
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: feat.reverse ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1"
              >
                <div className={`rounded-3xl bg-gradient-to-br ${feat.color} border ${feat.border} overflow-hidden`}>
                  {feat.visual}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
