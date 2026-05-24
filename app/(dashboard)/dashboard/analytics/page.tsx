"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, QrCode } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { EVENT_CATEGORIES } from "@/lib/types";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const PIE_COLORS = ["#7c3aed", "#6d28d9", "#4c1d95", "#a78bfa", "#c4b5fd"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || "#a78bfa" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: church } = await supabase.from("churches").select("id").eq("owner_id", user.id).single();
      if (!church) { setLoading(false); return; }

      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

      const [membersRes, eventsMonthRes, allEventsRes] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }).eq("church_id", church.id).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("church_id", church.id).gte("start_date", firstOfMonth),
        supabase.from("events").select("id, title, category, registered_count, capacity, start_date").eq("church_id", church.id).order("start_date", { ascending: false }).limit(20),
      ]);

      setMemberCount(membersRes.count || 0);
      setEventCount(eventsMonthRes.count || 0);
      setEvents(allEventsRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  // Category distribution from real events
  const categoryMap: Record<string, number> = {};
  events.forEach((ev) => {
    categoryMap[ev.category] = (categoryMap[ev.category] || 0) + 1;
  });
  const total = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;
  const categoryData = Object.entries(categoryMap).slice(0, 5).map(([key, count], i) => ({
    name: EVENT_CATEGORIES[key as keyof typeof EVENT_CATEGORIES]?.label || key,
    value: Math.round((count / total) * 100),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Top events by attendance
  const attendanceData = events
    .filter((ev) => ev.capacity && ev.capacity > 0)
    .slice(0, 5)
    .map((ev) => ({
      event: ev.title.length > 15 ? ev.title.slice(0, 15) + "…" : ev.title,
      avg: ev.registered_count || 0,
      capacity: ev.capacity,
    }));

  // Member growth chart (simple: 0 → current)
  const memberGrowth = [
    { month: "Início", members: 0 },
    { month: "Hoje", members: memberCount },
  ];

  const kpis = [
    { label: "Total de Membros", value: loading ? "—" : memberCount.toLocaleString("pt-BR"), icon: Users },
    { label: "Eventos este mês", value: loading ? "—" : String(eventCount), icon: Calendar },
    { label: "Check-ins este mês", value: "0", icon: QrCode },
    { label: "Total de Eventos", value: loading ? "—" : String(events.length), icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-poppins text-2xl font-black text-white">Analytics</h1>
        <p className="text-white/50 text-sm mt-0.5">Métricas e crescimento da sua comunidade</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="w-4 h-4 text-white/40" />
            </div>
            <p className="text-2xl font-black text-white">{kpi.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Member growth */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Crescimento de Membros</h3>
              <p className="text-xs text-white/40">Total atual</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {loading ? "—" : `${memberCount} membros`}
            </span>
          </div>
          {!loading && memberCount === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-white/20">
              <Users className="w-8 h-8 mb-2" />
              <p className="text-xs">Nenhum membro cadastrado ainda</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={memberGrowth}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="members" name="Membros" stroke="#7c3aed" strokeWidth={2} fill="url(#analyticsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Category distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Eventos por Categoria</h3>
          <p className="text-xs text-white/40 mb-4">Distribuição total</p>
          {categoryData.length === 0 ? (
            <div className="h-[150px] flex flex-col items-center justify-center text-white/20">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="text-xs">Sem eventos ainda</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-white/60 flex-1">{cat.name}</span>
                    <span className="text-white/40">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly check-ins (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Check-ins por Dia</h3>
          <p className="text-xs text-white/40 mb-4">Esta semana</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DAYS.map((day) => ({ day, value: 0 }))} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Check-ins" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Event attendance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Inscritos por Evento</h3>
          <p className="text-xs text-white/40 mb-4">vs capacidade</p>
          {attendanceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/20">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="text-xs">Sem eventos com capacidade definida</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceData.map((ev) => (
                <div key={ev.event}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{ev.event}</span>
                    <span className="text-white/40">{ev.avg}/{ev.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all"
                      style={{ width: `${Math.min((ev.avg / ev.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
