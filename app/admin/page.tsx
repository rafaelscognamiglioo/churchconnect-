"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueByPlan: Record<string, number> = { starter: 0, growth: 97, revival: 197, legacy: 397 };
const planColors: Record<string, string> = { starter: "text-white/50", growth: "text-blue-400", revival: "text-violet-400", legacy: "text-amber-400" };
const planLabels: Record<string, string> = { starter: "Starter", growth: "Growth", revival: "Revival", legacy: "Legacy" };

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function buildMonthlyGrowth(items: { created_at: string }[]) {
  const now = new Date();
  const months: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    const count = items.filter((item) => {
      const created = new Date(item.created_at);
      return created >= d && created < new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }).length;
    months.push({ month: label, total: count });
  }
  // make cumulative
  let acc = 0;
  return months.map((m) => { acc += m.total; return { month: m.month, igrejas: acc }; });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminPage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [totalChurches, setTotalChurches] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [mrr, setMrr] = useState(0);
  const [recentChurches, setRecentChurches] = useState<any[]>([]);
  const [planBreakdown, setPlanBreakdown] = useState<Record<string, number>>({});
  const [monthlyData, setMonthlyData] = useState<{ month: string; igrejas: number }[]>([]);

  useEffect(() => {
    async function load() {
      // Fetch all churches (RLS: only owned by current user in this context)
      const { data: churches } = await supabase
        .from("churches")
        .select("id, name, city, state, plan, created_at")
        .order("created_at", { ascending: false });

      const churchList = churches || [];
      const churchIds = churchList.map((c) => c.id);

      // Fetch members and events for these churches
      const [membersRes, eventsRes] = await Promise.all([
        churchIds.length > 0
          ? supabase.from("members").select("id", { count: "exact", head: true }).in("church_id", churchIds)
          : Promise.resolve({ count: 0 }),
        churchIds.length > 0
          ? supabase.from("events").select("id", { count: "exact", head: true }).in("church_id", churchIds)
          : Promise.resolve({ count: 0 }),
      ]);

      const breakdown: Record<string, number> = {};
      let mrrTotal = 0;
      for (const c of churchList) {
        breakdown[c.plan] = (breakdown[c.plan] || 0) + 1;
        mrrTotal += revenueByPlan[c.plan] || 0;
      }

      setTotalChurches(churchList.length);
      setTotalMembers((membersRes as any).count || 0);
      setTotalEvents((eventsRes as any).count || 0);
      setMrr(mrrTotal);
      setRecentChurches(churchList.slice(0, 6));
      setPlanBreakdown(breakdown);
      setMonthlyData(buildMonthlyGrowth(churchList));
      setLoading(false);
    }
    load();
  }, []);

  const kpis = [
    { label: "Igrejas cadastradas", value: totalChurches, icon: Building2, color: "text-violet-400", bg: "from-violet-500/20 to-purple-600/10 border-violet-500/20" },
    { label: "Total de membros", value: totalMembers, icon: Users, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-600/10 border-blue-500/20" },
    { label: "Eventos criados", value: totalEvents, icon: Calendar, color: "text-green-400", bg: "from-green-500/20 to-emerald-600/10 border-green-500/20" },
    { label: "MRR estimado", value: `R$ ${mrr.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-amber-400", bg: "from-amber-500/20 to-orange-600/10 border-amber-500/20" },
  ];

  return (
    <div className="p-6 space-y-6">
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
            <kpi.icon className={`w-5 h-5 ${kpi.color} mb-3`} />
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
              <h3 className="text-sm font-semibold text-white">Crescimento de Igrejas</h3>
              <p className="text-xs text-white/40">Acumulado nos últimos 6 meses</p>
            </div>
            <TrendingUp className="w-4 h-4 text-white/20" />
          </div>
          {!loading && totalChurches === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-white/20 text-sm">
              Nenhuma igreja cadastrada ainda
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="igrejasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="igrejas" name="Igrejas" stroke="#7c3aed" strokeWidth={2} fill="url(#igrejasGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
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
              const count = planBreakdown[plan] || 0;
              const total = totalChurches || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={plan}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={planColors[plan]}>{planLabels[plan]}</span>
                    <span className="text-white/40">{count} · {pct}%</span>
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
              {loading ? "—" : `R$ ${mrr.toLocaleString("pt-BR")}`}
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
          ) : recentChurches.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nenhuma igreja cadastrada ainda
            </div>
          ) : (
            recentChurches.map((church) => (
              <div key={church.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                  {church.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{church.name}</p>
                  <p className="text-xs text-white/40">{church.city || "—"}, {church.state || "—"}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  church.plan === "legacy" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                  church.plan === "revival" ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
                  church.plan === "growth" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-white/5 border-white/10 text-white/40"
                }`}>
                  {planLabels[church.plan] || church.plan}
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
