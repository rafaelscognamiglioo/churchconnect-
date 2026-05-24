"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "O ChurchConnect é gratuito?",
    a: "Sim! Temos um plano Starter completamente gratuito para igrejas de até 50 membros com até 5 eventos por mês. Você pode começar sem precisar de cartão de crédito.",
  },
  {
    q: "Preciso de conhecimento técnico para usar?",
    a: "Não. O ChurchConnect foi projetado para ser intuitivo e fácil de usar. Qualquer líder ou secretária pode gerenciar a plataforma sem conhecimento técnico. Oferecemos onboarding guiado e suporte completo.",
  },
  {
    q: "Como funciona o check-in por QR Code?",
    a: "Cada participante inscrito recebe um QR Code único por email. Na entrada do evento, o responsável escaneia o QR Code com qualquer smartphone e a presença é confirmada instantaneamente no sistema.",
  },
  {
    q: "Posso personalizar o visual da minha página?",
    a: "Sim! Cada igreja tem sua própria página com URL personalizada (churchconnect.com.br/minha-igreja). Você pode adicionar logo, foto de capa, cores e todas as informações da sua comunidade.",
  },
  {
    q: "Os dados dos meus membros estão seguros?",
    a: "Absolutamente. Utilizamos criptografia SSL, infraestrutura na nuvem (Supabase/Vercel) com backups diários. Seus dados nunca são compartilhados com terceiros e estamos em conformidade com a LGPD.",
  },
  {
    q: "Posso cancelar meu plano a qualquer momento?",
    a: "Sim, sem multas ou taxas. Você pode fazer downgrade ou cancelar a qualquer momento pelo painel de controle. Em caso de cancelamento, seus dados ficam disponíveis para exportação por 30 dias.",
  },
  {
    q: "Funciona para redes de igrejas?",
    a: "Sim! O plano Legacy foi desenvolvido especificamente para redes de igrejas. Você gerencia todas as igrejas da rede a partir de um único painel central, com relatórios consolidados.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Perguntas frequentes
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl font-black text-white mb-6">
            Tem alguma dúvida?
            <br />
            <span className="text-gradient">Temos a resposta.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i
                  ? "border-violet-500/30 bg-violet-500/5"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left gap-4"
              >
                <span className="font-semibold text-white text-base">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className={`w-5 h-5 transition-colors ${open === i ? "text-violet-400" : "text-white/40"}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-white/60 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
