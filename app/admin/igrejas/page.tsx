"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2, MapPin, Users, Calendar, Filter } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Church = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  pastor_name: string | null;
  plan: string;
  verified: boolean;
  created_at: string;
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
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("churches")
        .select("id, name, city, state, pastor_name, plan, verified, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        // Fetch member/event counts for each church
        const enriched = await Promise.all(
          data.map(async (church) => {
            const [membersRes, eventsRes] = await Promise.all([
              supabase.from("members").select("id", { count: "exact", head: true }).eq("church_id", church.id),
              supabase.from("events").select("id", { count: "exact", head: true }).eq("church_id", church.id),
            ]);
            return { ...church, member_count: membersRes.count || 0, event_count: eventsRes.count || 0 };
          })
        );
        setChurches(enriched);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = churches.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.pastor_name || "").toLowerCase().includes(search.toLowerCase());
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
            placeholder="Buscar por nome, cidade ou pastor..."
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

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-white/30 uppercase tracking-wider">
          <div className="col-span-4">Igreja</div>
          <div className="col-span-2">Localização</div>
          <div className="col-span-2">Pastor</div>
          <div className="col-span-1 text-center">Membros</div>
          <div className="col-span-1 text-center">Eventos</div>
          <div className="col-span-1 text-center">Plano</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {loading ? (
            [1,2,3,4,5].map((i) => (
              <div key={i} className="h-14 mx-5 my-2 rounded-xl bg-white/5 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 text-white/30">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma igreja encontrada</p>
            </div>
          ) : (
            filtered.map((church, i) => {
              const cfg = planConfig[church.plan] || planConfig.starter;
              return (
                <motion.div
                  key={church.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                      {church.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{church.name}</p>
                      <p className="text-xs text-white/30">{new Date(church.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-xs text-white/50">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{church.city || "—"}, {church.state || "—"}</span>
                  </div>
                  <div className="col-span-2 text-xs text-white/50 truncate">{church.pastor_name || "—"}</div>
                  <div className="col-span-1 text-center">
                    <span className="flex items-center justify-center gap-1 text-xs text-white/50">
                      <Users className="w-3 h-3" />{church.member_count}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="flex items-center justify-center gap-1 text-xs text-white/50">
                      <Calendar className="w-3 h-3" />{church.event_count}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={cn("inline-block w-2 h-2 rounded-full", church.verified ? "bg-green-400" : "bg-white/20")} title={church.verified ? "Verificada" : "Pendente"} />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
