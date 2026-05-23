"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, Activity, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueByPlan: Record<string, number> = { starter: 0, growth: 97, revival: 197, legacy: 397 };

const monthlyData = [
  { month: "Jan", igrejas: 3, receita: 582 },
  { month: "Fev", igrejas: 5, receita: 970 },
  { month: "Mar", igrejas: 8, receita: 1552 },
  { month: "Abr", igrejas: 11, receita: 2134 },
  { month: "Mai", igrejas: 15, receita: 2910 },
  { month: "Jun", igrejas: 20, receita: 3880 },
];

interface AdminStats {
  totalChurches: number;
  totalMembers: number;
  totalEvents: number;
  mrr: number;
  recentChurches: Array<{ id: string; name: string; city: string; state: string; plan: string; created_at: string }>;
  planBreakdown: Record<string, number>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.dataKey === "receita" ? `R$ ${p.value.toLocaleString("pt-BR")}` : p.value}</p>
      ))}
    </div>
  );
};

const planColors: Record<string, string> = { starter: "text-white/50", growth: "text-blue-400", revival: "text-violet-400", legacy: "text-amber-400" };
const planLabels: Record<string, string> = { starter: "Starter", growth: "Growth", revival: "Revival", legacy: "Legacy" };

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const [churchesRes, membersRes, eventsRes] = await Promise.all([
        supabase.from("churches").select("id, name, city, state, plan, created_at").order("created_at", { ascending: false }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);

      const churches = churchesRes.data || [];
      const planBreakdown: Record<string, number> = {};
      let mrr = 0;
      for (const c of churches) {
        planBreakdown[c.plan] = (planBreakdown[c.plan] || 0) + 1;
        mrr += revenueByPlan[c.plan] || 0;
      }

      setStats({
        totalChurches: churches.length,
        totalMembers: membersRes.count || 0,
        totalEvents: eventsRes.count || 0,
        mrr,
        recentChurches: churches.slice(0, 6),
        planBreakdown,
      });
      setLoading(false);
    }
    load();
  }, []);

  const kpis = [
    { label: "Igrejas cadastradas", value: stats?.totalChurches ?? "—", icon: Building2, color: "text-violet-400", bg: "from-violet-500/20 to-purple-600/10 border-violet-500/20", change: "+20%" },
    { label: "Total de membros", value: stats?.totalMembers ?? "—", icon: Users, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-600/10 border-blue-500/20", change: "+12%" },
    { label: "Eventos criados", value: stats?.totalEvents ?? "—", icon: Calendar, color: "text-green-400", bg: "from-green-500/20 to-emerald-600/10 border-green-500/20", change: "+8%" },
    { label: "MRR estimado", value: stats ? `R$ ${stats.mrr.toLocaleString("pt-BR")}` : "—", icon: DollarSign, color: "text-amber-400", bg: "from-amber-500/20 to-orange-600/10 border-amber-500/20", change: "+33%" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Sistema operacional</span>
          </div>
          <h1 className="font-poppins text-2xl font-black text-white">Painel Administrativo</h1>
          <p className="text-white/40 text-sm mt-0.5">Visão completa da plataforma ChurchConnect</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          SUPER ADMIN
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl bg-gradient-to-br border ${kpi.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-400">
                <ArrowUpRight className="w-3 h-3" />{kpi.change}
              </span>
            </div>
            <p className="text-2xl font-black text-white">{loading ? "—" : kpi.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Crescimento da Plataforma</h3>
              <p className="text-xs text-white/40">Igrejas e receita por mês</p>
            </div>
            <TrendingUp className="w-4 h-4 text-white/20" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="igrejasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="igrejas" name="Igrejas" stroke="#7c3aed" strokeWidth={2} fill="url(#igrejasGrad)" />
              <Area type="monotone" dataKey="receita" name="Receita" stroke="#f59e0b" strokeWidth={2} fill="url(#receitaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plan breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Distribuição de Planos</h3>
          <p className="text-xs text-white/40 mb-5">Igrejas ativas por plano</p>
          <div className="space-y-4">
            {["starter", "growth", "revival", "legacy"].map((plan) => {
              const count = stats?.planBreakdown[plan] || 0;
              const total = stats?.totalChurches || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={plan}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={planColors[plan]}>{planLabels[plan]}</span>
                    <span className="text-white/40">{count} igrejas · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full ${plan === "starter" ? "bg-white/20" : plan === "growth" ? "bg-blue-500" : plan === "revival" ? "bg-violet-500" : "bg-amber-500"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-white/40">MRR Total</p>
            <p className="text-xl font-black text-amber-400">
              {loading ? "—" : `R$ ${(stats?.mrr || 0).toLocaleString("pt-BR")}`}
            </p>
            <p className="text-xs text-white/30 mt-0.5">receita mensal recorrente estimada</p>
          </div>
        </motion.div>
      </div>

      {/* Recent churches */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Igrejas Recentes</h3>
          <a href="/admin/igrejas" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ver todas →</a>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading ? (
            [1,2,3].map((i) => <div key={i} className="h-14 mx-5 my-3 rounded-xl bg-white/5 animate-pulse" />)
          ) : stats?.recentChurches.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nenhuma igreja cadastrada ainda
            </div>
          ) : (
            stats?.recentChurches.map((church) => (
              <div key={church.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                  {church.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{church.name}</p>
                  <p className="text-xs text-white/40">{church.city}, {church.state}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  church.plan === "legacy" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                  church.plan === "revival" ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
                  church.plan === "growth" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-white/5 border-white/10 text-white/40"
                }`}>
                  {planLabels[church.plan]}
                </span>
                <span className="text-xs text-white/25 shrink-0">
                  {new Date(church.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
