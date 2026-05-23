"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap, Star, Crown, Sparkles } from "lucide-react";
import { PLANS } from "@/lib/types";

const planIcons = {
  starter: Zap,
  growth: Star,
  revival: Sparkles,
  legacy: Crown,
};

const planKeys = ["starter", "growth", "revival", "legacy"] as const;

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="planos" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            <Crown className="w-3.5 h-3.5" />
            Planos
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Preços simples e
            <br />
            <span className="text-gradient">transparentes.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            Comece grátis. Escale conforme sua comunidade cresce.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !annual ? "bg-white text-[#080812]" : "text-white/60 hover:text-white"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? "bg-white text-[#080812]" : "text-white/60 hover:text-white"
              }`}
            >
              Anual
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-green-500 text-white">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {planKeys.map((key, i) => {
            const plan = PLANS[key];
            const Icon = planIcons[key];
            const price = annual ? Math.round(plan.price * 0.8) : plan.price;
            const isHighlighted = plan.highlight;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden flex flex-col ${
                  isHighlighted
                    ? "border-2 border-violet-500/50 shadow-glow-purple"
                    : "border border-white/10"
                }`}
              >
                {isHighlighted && (
                  <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-purple-600/5 pointer-events-none" />
                )}
                {isHighlighted && (
                  <div className="relative text-center py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold tracking-wider">
                    MAIS POPULAR ✦
                  </div>
                )}

                <div className="relative p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-3 ${
                        isHighlighted
                          ? "bg-gradient-to-br from-violet-500 to-purple-600"
                          : "bg-white/10"
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-poppins text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    {price === 0 ? (
                      <div>
                        <span className="text-4xl font-black font-poppins text-white">Grátis</span>
                        <p className="text-xs text-white/40 mt-1">Para sempre</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className="text-sm text-white/50 mb-2">R$</span>
                          <span className="text-4xl font-black font-poppins text-white">{price}</span>
                          <span className="text-sm text-white/50 mb-2">/mês</span>
                        </div>
                        {annual && (
                          <p className="text-xs text-green-400">
                            Economize R${(plan.price * 0.2 * 12).toFixed(0)}/ano
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 mb-6 text-sm text-white/50">
                    <p>
                      <span className="font-semibold text-white">
                        {plan.members === "unlimited" ? "Membros ilimitados" : `Até ${plan.members.toLocaleString()} membros`}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-white">
                        {plan.events === "unlimited" ? "Eventos ilimitados" : `${plan.events} eventos/mês`}
                      </span>
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-white/70">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlighted ? "text-violet-400" : "text-green-400"}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/igrejas/cadastro"
                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isHighlighted
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25"
                        : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                    }`}
                  >
                    {price === 0 ? "Começar grátis" : "Escolher plano"}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-white/30 mt-10"
        >
          Sem taxa de setup · Cancele quando quiser · Suporte incluso em todos os planos
        </motion.p>
      </div>
    </section>
  );
}
