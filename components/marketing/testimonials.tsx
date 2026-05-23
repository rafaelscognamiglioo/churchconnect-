"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Pr. Marcos Oliveira",
    role: "Pastor | Igreja Restauração",
    city: "São Paulo, SP",
    avatar: "MO",
    rating: 5,
    text: "O ChurchConnect transformou completamente como gerenciamos nossa comunidade. Em 3 meses, nossa presença nos cultos cresceu 40% só com os lembretes automáticos.",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Líder Ana Paula",
    role: "Coordenadora de Eventos | IBL",
    city: "Rio de Janeiro, RJ",
    avatar: "AP",
    rating: 5,
    text: "Antes usávamos planilhas e grupos de WhatsApp para tudo. Hoje tudo está centralizado. O check-in por QR Code na nossa conferência de 800 pessoas foi impecável.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Pr. Ricardo Santos",
    role: "Pastor Presidente | AD Vitória",
    city: "Belo Horizonte, MG",
    avatar: "RS",
    rating: 5,
    text: "Impressionante como uma plataforma tão profissional e moderna foi feita especificamente para igrejas. Nossa rede de 12 igrejas gerencia tudo pelo ChurchConnect.",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Diac. Fernanda Lima",
    role: "Líder de Células | Comunidade da Graça",
    city: "Curitiba, PR",
    avatar: "FL",
    rating: 5,
    text: "A função de células é incrível. Consigo ver a frequência de cada membro, enviar mensagens em lote e gerar relatórios para a liderança em segundos.",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Pr. Eduardo Melo",
    role: "Pastor | Igreja Renascer Local",
    city: "Salvador, BA",
    avatar: "EM",
    rating: 5,
    text: "O suporte é extraordinário. Toda vez que precisamos de ajuda, a equipe responde rápido e com soluções reais. Não consigo imaginar gerir a igreja sem o ChurchConnect.",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Sec. Camila Torres",
    role: "Secretária Geral | Hillsong Local",
    city: "Porto Alegre, RS",
    avatar: "CT",
    rating: 5,
    text: "A geração automática de relatórios nos economizou horas toda semana. Nosso pastor agora tem acesso a dados em tempo real do smartphone. Perfeito!",
    color: "from-indigo-500 to-violet-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#080812]" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-amber-300" />
            Depoimentos
          </div>
          <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Igrejas que já
            <br />
            <span className="text-gradient">transformaram</span> sua gestão.
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Mais de 2.400 líderes confiam no ChurchConnect para gerenciar
            suas comunidades com eficiência e modernidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all duration-300 hover:-translate-y-1 group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-6 font-light">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                  <p className="text-xs text-white/30">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregated rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="text-4xl font-black font-poppins text-white">4.9</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-white">2.400+</div>
              <div className="text-sm text-white/40">Igrejas satisfeitas</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-white">180K+</div>
              <div className="text-sm text-white/40">Avaliações positivas</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
