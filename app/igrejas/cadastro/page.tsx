import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";

const features = [
  "Página institucional personalizada",
  "Gestão completa de eventos",
  "Check-in por QR Code",
  "Cadastro e gestão de membros",
  "Comunicados por email",
  "Analytics e relatórios",
  "Suporte especializado",
];

export default function CadastroIgrejaPage() {
  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — pitch */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
                <Zap className="w-3.5 h-3.5" />
                Cadastre sua Igreja gratuitamente
              </div>

              <h1 className="font-poppins text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Seu hub está
                <br />
                <span className="text-gradient">pronto para você.</span>
              </h1>

              <p className="text-lg text-white/50 mb-8 leading-relaxed">
                Em menos de 5 minutos, sua igreja terá uma plataforma completa para gestão de eventos,
                membros, check-in e muito mais. Comece grátis, sem cartão de crédito.
              </p>

              <ul className="space-y-3 mb-10">
                {features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-white/70">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-sm text-white/60 italic mb-4">
                  "Configuramos o ChurchConnect em 10 minutos. No mesmo dia já estávamos
                  gerenciando nossos eventos e enviando confirmações por email."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    AP
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Ana Paula</p>
                    <p className="text-xs text-white/40">Coord. de Eventos · IBL · RJ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — redirect to register */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.10]">
              <h2 className="font-poppins text-2xl font-black text-white mb-2">Começar agora</h2>
              <p className="text-white/50 text-sm mb-8">Crie sua conta e configure sua igreja em minutos.</p>

              <div className="space-y-3">
                <Link
                  href="/registro"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-base font-bold text-white"
                >
                  <Zap className="w-5 h-5" />
                  Cadastrar minha Igreja — Grátis
                </Link>

                <p className="text-center text-xs text-white/30">
                  Sem cartão de crédito · Cancele quando quiser
                </p>
              </div>

              {/* Plan comparison */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 mb-4 text-center">Incluso no plano gratuito:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Até 50 membros",
                    "5 eventos/mês",
                    "Página institucional",
                    "Lista de presença",
                    "Relatórios básicos",
                    "Suporte por email",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-white/40">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
