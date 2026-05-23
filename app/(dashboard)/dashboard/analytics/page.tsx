"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, QrCode, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const memberGrowth = [
  { month: "Jan", members: 980, new: 42 },
  { month: "Fev", members: 1020, new: 58 },
  { month: "Mar", members: 1085, new: 71 },
  { month: "Abr", members: 1130, new: 55 },
  { month: "Mai", members: 1198, new: 68 },
  { month: "Jun", members: 1248, new: 74 },
];

const eventAttendance = [
  { event: "Culto Dom", avg: 342, capacity: 400 },
  { event: "Célula", avg: 28, capacity: 35 },
  { event: "Conferência", avg: 180, capacity: 200 },
  { event: "Retiro", avg: 89, capacity: 100 },
  { event: "Jovens", avg: 115, capacity: 130 },
];

const weeklyCheckins = [
  { day: "Seg", value: 12 },
  { day: "Ter", value: 8 },
  { day: "Qua", value: 45 },
  { day: "Qui", value: 18 },
  { day: "Sex", value: 22 },
  { day: "Sáb", value: 190 },
  { day: "Dom", value: 342 },
];

const categoryData = [
  { name: "Culto", value: 45, color: "#7c3aed" },
  { name: "Célula", value: 20, color: "#6d28d9" },
  { name: "Jovens", value: 18, color: "#4c1d95" },
  { name: "Conferência", value: 12, color: "#a78bfa" },
  { name: "Outros", value: 5, color: "#c4b5fd" },
];

const kpis = [
  { label: "Total de Membros", value: "1.248", change: "+12%", up: true, icon: Users },
  { label: "Eventos este mês", value: "12", change: "+3", up: true, icon: Calendar },
  { label: "Check-ins este mês", value: "2.847", change: "+18%", up: true, icon: QrCode },
  { label: "Taxa de retenção", value: "94%", change: "-1%", up: false, icon: TrendingUp },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
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
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
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
              <p className="text-xs text-white/40">Últimos 6 meses</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              +27% no período
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={memberGrowth}>
              <defs>
                <linearGradient id="membersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="members" name="Total" stroke="#7c3aed" strokeWidth={2} fill="url(#membersGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Eventos por Categoria</h3>
          <p className="text-xs text-white/40 mb-4">Distribuição mensal</p>
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
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Check-ins por Dia</h3>
          <p className="text-xs text-white/40 mb-4">Esta semana</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyCheckins} barSize={28}>
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
          <h3 className="text-sm font-semibold text-white mb-1">Presença Média por Evento</h3>
          <p className="text-xs text-white/40 mb-4">vs capacidade</p>
          <div className="space-y-3">
            {eventAttendance.map((ev) => (
              <div key={ev.event}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{ev.event}</span>
                  <span className="text-white/40">{ev.avg}/{ev.capacity}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all"
                    style={{ width: `${(ev.avg / ev.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
