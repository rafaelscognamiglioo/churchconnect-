"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Send, Users, Bell, Mail, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockComunicados = [
  {
    id: "1",
    title: "Culto especial de aniversário da Igreja",
    message: "Neste domingo teremos um culto especial em comemoração ao aniversário da nossa comunidade. Convidamos todos os membros!",
    type: "announcement",
    sent_at: "2025-05-22T10:00:00",
    recipients: 1248,
    read_count: 847,
  },
  {
    id: "2",
    title: "Lembrete: Retiro Espiritual 2025",
    message: "Restam apenas 15 vagas para o Retiro Espiritual. Faça sua inscrição até sexta-feira.",
    type: "reminder",
    sent_at: "2025-05-20T14:30:00",
    recipients: 300,
    read_count: 212,
  },
  {
    id: "3",
    title: "Novo membro: Bem-vindos!",
    message: "Recebemos com alegria 8 novos membros esta semana. Que Deus abençoe cada um!",
    type: "welcome",
    sent_at: "2025-05-18T09:00:00",
    recipients: 1248,
    read_count: 634,
  },
];

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Bell }> = {
  announcement: { label: "Anúncio", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", icon: Megaphone },
  reminder: { label: "Lembrete", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Bell },
  welcome: { label: "Boas-vindas", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ComunicadosPage() {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "announcement", channel: "push" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setShowNew(false); setForm({ title: "", message: "", type: "announcement", channel: "push" }); }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Comunicados</h1>
          <p className="text-white/50 text-sm mt-0.5">Envie mensagens para toda a comunidade</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          Novo Comunicado
        </button>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Bell, label: "Push", desc: "App e navegador", count: "1.248" },
          { icon: Mail, label: "Email", desc: "Caixa de entrada", count: "987" },
        ].map((ch) => (
          <div key={ch.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <ch.icon className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{ch.label}</p>
              <p className="text-xs text-white/40">{ch.count} membros · {ch.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Histórico</h2>
        {mockComunicados.map((c, i) => {
          const cfg = typeConfig[c.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                  <Icon className={cn("w-4 h-4", cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{c.title}</h3>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2 mb-3">{c.message}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.recipients} destinatários</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500/60" />{c.read_count} lidos ({Math.round((c.read_count / c.recipients) * 100)}%)</span>
                    <span>{formatDate(c.sent_at)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* New comunicado modal */}
      <AnimatePresence>
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-poppins text-lg font-bold text-white">Novo Comunicado</h2>
                <button onClick={() => setShowNew(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">Comunicado enviado!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Tipo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(typeConfig).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => setForm({ ...form, type: key })}
                          className={cn("py-2 rounded-xl border text-xs font-medium transition-all", form.type === key ? `${cfg.bg} ${cfg.color}` : "border-white/10 text-white/40 hover:border-white/20")}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Canal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ key: "push", label: "Push" }, { key: "email", label: "Email" }].map((ch) => (
                        <button
                          key={ch.key}
                          onClick={() => setForm({ ...form, channel: ch.key })}
                          className={cn("py-2 rounded-xl border text-xs font-medium transition-all", form.channel === ch.key ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "border-white/10 text-white/40 hover:border-white/20")}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Título</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Assunto do comunicado"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Mensagem</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Escreva sua mensagem aqui..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm transition-all">
                      Cancelar
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!form.title || !form.message || sending}
                      className="flex-1 relative py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden disabled:opacity-40"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600" />
                      <span className="relative flex items-center justify-center gap-2">
                        {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" />Enviar</>}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
