"use client";

import { motion } from "framer-motion";
import { EVENT_CATEGORIES } from "@/lib/types";
import { Calendar } from "lucide-react";

export function EventCategoriesSection() {
  const categories = Object.values(EVENT_CATEGORIES);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            <Calendar className="w-3.5 h-3.5" />
            Todos os tipos de eventos
          </div>
          <h2 className="font-poppins text-3xl md:text-4xl font-black text-white mb-4">
            Para cada atividade da sua
            <span className="text-gradient"> comunidade.</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Cultos, células, conferências, retiros, batismos e muito mais.
            O ChurchConnect cobre todas as atividades da sua igreja.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-default"
            >
              <span className="text-lg">{cat.icon}</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${cat.color}`}>
                {cat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
