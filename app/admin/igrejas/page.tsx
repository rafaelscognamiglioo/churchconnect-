"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Building2, MapPin, Users, Calendar, Filter,
  ChevronDown, ChevronUp, Mail, Phone, Globe, Instagram,
  ExternalLink, CheckCircle2, Clock, X
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Church = {
  id: string;
  name: string;
  slug: string | null;
  city: string | null;
  state: string | null;
  pastor_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  description: string | null;
  plan: string;
  verified: boolean;
  created_at: string;
  owner_id: string;
  member_count?: number;
  event_count?: number;
};

const planConfig: Record<string, { label: string; color: string; bg: string }> = {
  starter: { label: "Starter", color: "text-white/50", bg: "bg-white/5 border-white/10" },
  growth: { label: "Growth", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  revival: { label: "Revival", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  legacy: { label: "Legacy", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
};

export default function AdminIgrejasPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("churches")
        .select("id, name, slug, city, state, pastor_name, email, phone, website, instagram, description, plan, verified, created_at, owner_id")
        .order("created_at", { ascending: false });

      if (data) {
        const churchIds = data.map((c) => c.id);
        const [membersRes, eventsRes] = await Promise.all([
          supabase.from("members").select("id, church_id").in("church_id", churchIds),
          supabase.from("events").select("id, church_id").in("church_id", churchIds),
        ]);

        const memberCounts: Record<string, number> = {};
        const eventCounts: Record<string, number> = {};
        (membersRes.data || []).forEach((m) => { memberCounts[m.church_id] = (memberCounts[m.church_id] || 0) + 1; });
        (eventsRes.data || []).forEach((e) => { eventCounts[e.church_id] = (eventCounts[e.church_id] || 0) + 1; });

        setChurches(data.map((c) => ({
          ...c,
          member_count: memberCounts[c.id] || 0,
          event_count: eventCounts[c.id] || 0,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = churches.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.pastor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || c.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Igrejas</h1>
          <p className="text-white/40 text-sm mt-0.5">{churches.length} igrejas cadastradas na plataforma</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, cidade ou pastor..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 focus:outline-none focus:border-violet-500/50 text-sm transition-all appearance-none"
          >
            <option value="all" className="bg-[#0d0d1f]">Todos os planos</option>
            <option value="starter" className="bg-[#0d0d1f]">Starter</option>
            <option value="growth" className="bg-[#0d0d1f]">Growth</option>
            <option value="revival" className="bg-[#0d0d1f]">Revival</option>
            <option value="legacy" className="bg-[#0d0d1f]">Legacy</option>
          </select>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {loading ? (
          [1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-white/30 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma igreja encontrada</p>
          </div>
        ) : (
          filtered.map((church, i) => {
            const cfg = planConfig[church.plan] || planConfig.starter;
            const isExpanded = expanded === church.id;
            return (
              <motion.div
                key={church.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden"
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : church.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-300 shrink-0">
                    {church.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{church.name}</p>
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", cfg.bg, cfg.color)}>
                        {cfg.label}
                      </span>
                      {church.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verificada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      {church.pastor_name && <span className="text-xs text-white/40">{church.pastor_name}</span>}
                      {church.email && <span className="flex items-center gap-1 text-xs text-white/40"><Mail className="w-3 h-3" />{church.email}</span>}
                      {(church.city || church.state) && <span className="flex items-center gap-1 text-xs text-white/40"><MapPin className="w-3 h-3" />{[church.city, church.state].filter(Boolean).join(", ")}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{church.member_count}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{church.event_count}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(church.created_at).toLocaleDateString("pt-BR")}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                          {/* Identification */}
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Identificação</p>
                            <InfoRow label="ID da Igreja" value={church.id} mono />
                            <InfoRow label="Owner ID" value={church.owner_id} mono />
                            <InfoRow label="Slug / URL" value={church.slug || "—"} />
                            <InfoRow label="Cadastro" value={new Date(church.created_at).toLocaleString("pt-BR")} />
                          </div>

                          {/* Contact */}
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Contato</p>
                            <InfoRow label="E-mail" value={church.email || "—"} icon={<Mail className="w-3 h-3" />} />
                            <InfoRow label="Telefone" value={church.phone || "—"} icon={<Phone className="w-3 h-3" />} />
                            <InfoRow label="Website" value={church.website || "—"} icon={<Globe className="w-3 h-3" />} link={church.website || undefined} />
                            <InfoRow label="Instagram" value={church.instagram || "—"} icon={<Instagram className="w-3 h-3" />} />
                          </div>

                          {/* Location & plan */}
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Localização & Plano</p>
                            <InfoRow label="Pastor(a)" value={church.pastor_name || "—"} />
                            <InfoRow label="Cidade" value={church.city || "—"} />
                            <InfoRow label="Estado" value={church.state || "—"} />
                            <InfoRow label="Plano" value={cfg.label} />
                            <InfoRow label="Verificada" value={church.verified ? "Sim" : "Não"} />
                          </div>
                        </div>

                        {church.description && (
                          <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Descrição</p>
                            <p className="text-sm text-white/60 leading-relaxed">{church.description}</p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                          <span className="text-xs text-white/25 flex items-center gap-1">
                            🔒 Senha: não acessível (criptografada pelo Supabase Auth — padrão de segurança)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono, icon, link }: { label: string; value: string; mono?: boolean; icon?: React.ReactNode; link?: string }) {
  return (
    <div>
      <p className="text-[10px] text-white/30 mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-white/40">{icon}</span>}
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors truncate">
            {value} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
          </a>
        ) : (
          <p className={cn("text-xs text-white/70 truncate", mono && "font-mono text-[10px] text-white/40")}>{value}</p>
        )}
      </div>
    </div>
  );
}
