"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Building2, ArrowUpRight, CreditCard, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PLAN_PRICES: Record<string, number> = { starter: 0, growth: 97, revival: 197, legacy: 397 };
const PLAN_LABELS: Record<string, string> = { starter: "Starter", growth: "Growth", revival: "Revival", legacy: "Legacy" };
const PLAN_COLORS: Record<string, string> = { starter: "#ffffff20", growth: "#3b82f6", revival: "#7c3aed", legacy: "#f59e0b" };

const projectionData = [
  { month: "Jul", mrr: 4200 },
  { month: "Ago", mrr: 5100 },
  { month: "Set", mrr: 6300 },
  { month: "Out", mrr: 7800 },
  { month: "Nov", mrr: 9200 },
  { month: "Dez", mrr: 11000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      <p className="text-amber-400">R$ {payload[0]?.value?.toLocaleString("pt-BR")}</p>
    </div>
  );
};

export default function AdminReceitaPage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("churches")
        .select("id, name, plan, city, state, created_at")
        .order("created_at", { ascending: false });
      setChurches(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const mrr = churches.reduce((sum, c) => sum + (PLAN_PRICES[c.plan] || 0), 0);
  const arr = mrr * 12;
  const paying = churches.filter((c) => c.plan !== "starter").length;

  const planBreakdown = ["starter", "growth", "revival", "legacy"].map((plan) => {
    const count = churches.filter((c) => c.plan === plan).length;
    const revenue = count * PLAN_PRICES[plan];
    return { plan, label: PLAN_LABELS[plan], count, revenue, color: PLAN_COLORS[plan] };
  });

  const barData = planBreakdown.filter(p => p.plan !== "starter").map(p => ({
    name: p.label, receita: p.revenue, igrejas: p.count,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-poppins text-2xl font-black text-white">Receita</h1>
        <p className="text-white/40 text-sm mt-0.5">Faturamento e projeções da plataforma</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: `R$ ${mrr.toLocaleString("pt-BR")}`, sub: "receita mensal recorrente", icon: DollarSign, color: "text-amber-400", bg: "from-amber-500/20 to-orange-600/10 border-amber-500/20" },
          { label: "ARR", value: `R$ ${arr.toLocaleString("pt-BR")}`, sub: "receita anual projetada", icon: TrendingUp, color: "text-green-400", bg: "from-green-500/20 to-emerald-600/10 border-green-500/20" },
          { label: "Igrejas pagantes", value: paying, sub: `de ${churches.length} total`, icon: Building2, color: "text-violet-400", bg: "from-violet-500/20 to-purple-600/10 border-violet-500/20" },
          { label: "Ticket médio", value: paying > 0 ? `R$ ${Math.round(mrr / paying)}` : "R$ 0", sub: "por igreja pagante/mês", icon: CreditCard, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-600/10 border-blue-500/20" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl bg-gradient-to-br border ${kpi.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
            </div>
            <p className={`text-2xl font-black ${kpi.color}`}>{loading ? "—" : kpi.value}</p>
            <p className="text-xs text-white/60 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-white/25 mt-0.5">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Receita por plano */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Receita por Plano</h3>
          <p className="text-xs text-white/40 mb-4">MRR gerado por cada tier</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="receita" name="Receita" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Projeção */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white">Projeção de MRR</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">Projeção</span>
          </div>
          <p className="text-xs text-white/40 mb-4">Próximos 6 meses (estimado)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={projectionData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mrr" name="MRR" fill="#7c3aed" radius={[6, 6, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Plan breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
      >
        <div className="p-5 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Detalhamento por Plano</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {planBreakdown.map((plan) => (
            <div key={plan.plan} className="flex items-center gap-4 px-5 py-4">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{plan.label}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/40">{plan.count} igrejas</span>
                    <span className="font-bold text-white">
                      {plan.revenue > 0 ? `R$ ${plan.revenue.toLocaleString("pt-BR")}/mês` : "Grátis"}
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${churches.length > 0 ? (plan.count / churches.length) * 100 : 0}%`,
                      backgroundColor: plan.color,
                    }}
                  />
                </div>
              </div>
              {plan.plan !== "starter" && plan.count > 0 && (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
          <span className="text-sm font-semibold text-white/60">Total MRR</span>
          <span className="text-lg font-black text-amber-400">R$ {mrr.toLocaleString("pt-BR")}/mês</span>
        </div>
      </motion.div>
    </div>
  );
}
