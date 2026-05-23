"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTAFinal() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-blue-900/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 items-center justify-center mb-8 shadow-glow-purple">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>

          <h2 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Sua igreja merece
            <br />
            <span className="text-gradient">o melhor.</span>
          </h2>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Junte-se às mais de 2.400 igrejas que já modernizaram sua gestão.
            Comece hoje, grátis, sem cartão de crédito.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/igrejas/cadastro"
              className="group relative inline-flex items-center gap-2 px-10 py-5 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600" />
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Cadastrar minha Igreja
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/planos"
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white/80 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              Ver planos
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/30">
            Grátis para começar · Sem cartão de crédito · Setup em 5 minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
}
