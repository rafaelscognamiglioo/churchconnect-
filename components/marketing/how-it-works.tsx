"use client";

import { motion } from "framer-motion";
import { Building2, Settings, Users, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Cadastre sua Igreja",
    description: "Preencha o perfil completo da sua comunidade com logo, pastores, endereço e redes sociais. Em minutos.",
    color: "from-violet-500 to-purple-600",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure o sistema",
    description: "Defina os grupos, células, departamentos e categorias de eventos que sua igreja utiliza.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    number: "03",
    icon: Users,
    title: "Cadastre os membros",
    description: "Importe ou cadastre manualmente seus membros. Eles receberão acesso ao portal automaticamente.",
    color: "from-green-500 to-emerald-600",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Lance seus eventos",
    description: "Crie eventos, divulgue, receba inscrições e faça check-in. Tudo em um só lugar.",
    color: "from-amber-500 to-orange-600",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-blue-900/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium mb-6">
            <Rocket className="w-3.5 h-3.5" />
            Como funciona
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Do zero ao <span className="text-gradient">hub completo</span>
            <br />
            em menos de 10 minutos.
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Processo simples, rápido e guiado. Sem precisar de suporte técnico.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#080812] border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white/60">{step.number}</span>
                  </div>
                </div>

                <h3 className="font-poppins text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
