"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Calendar, CheckCircle2, TrendingUp, ArrowUpRight,
  Bell, QrCode, Clock, MapPin, ChevronRight, Plus
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const emptyCheckinsData = DAYS.map((day) => ({ day, value: 0 }));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-violet-300">{p.value}</p>
      ))}
    </div>
  );
};

interface DashboardData {
  church: { name: string; city: string; pastor_name: string; plan: string } | null;
  memberCount: number;
  eventCount: number;
  upcomingEvents: Array<{ id: string; title: string; start_date: string; start_time: string; location: string | null; registered_count: number; capacity: number | null }>;
  userName: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    church: null,
    memberCount: 0,
    eventCount: 0,
    upcomingEvents: [],
    userName: "Pastor",
  });
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Pastor";

      // Fetch church
      const { data: church } = await supabase
        .from("churches")
        .select("id, name, city, pastor_name, plan")
        .eq("owner_id", user.id)
        .single();

      if (!church) {
        setData((d) => ({ ...d, userName }));
        setLoading(false);
        return;
      }

      // Fetch counts in parallel
      const [membersRes, eventsRes, upcomingRes] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }).eq("church_id", church.id).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("church_id", church.id).eq("status", "published"),
        supabase.from("events")
          .select("id, title, start_date, start_time, location, registered_count, capacity")
          .eq("church_id", church.id)
          .eq("status", "published")
          .gte("start_date", new Date().toISOString().split("T")[0])
          .order("start_date", { ascending: true })
          .limit(5),
      ]);

      setData({
        church,
        memberCount: membersRes.count || 0,
        eventCount: eventsRes.count || 0,
        upcomingEvents: upcomingRes.data || [],
        userName,
      });
      setLoading(false);
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1);

  const stats = [
    {
      label: "Total de Membros",
      value: loading ? "—" : data.memberCount.toLocaleString("pt-BR"),
      change: loading ? "—" : `${data.memberCount} total`,
      up: true,
      icon: Users,
      color: "from-violet-500/20 to-purple-600/10",
      border: "border-violet-500/20",
      iconColor: "text-violet-400",
      link: null,
    },
    {
      label: "Eventos Ativos",
      value: loading ? "—" : String(data.eventCount),
      change: "publicados",
      up: true,
      icon: Calendar,
      color: "from-blue-500/20 to-cyan-600/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      link: null,
    },
    {
      label: "Check-ins Hoje",
      value: "0",
      change: "em tempo real",
      up: true,
      icon: CheckCircle2,
      color: "from-green-500/20 to-emerald-600/10",
      border: "border-green-500/20",
      iconColor: "text-green-400",
      link: null,
    },
    {
      label: "Plano Atual",
      value: loading ? "—" : (data.church?.plan ? data.church.plan.charAt(0).toUpperCase() + data.church.plan.slice(1) : "Starter"),
      change: "ver planos →",
      up: true,
      icon: TrendingUp,
      color: "from-amber-500/20 to-orange-600/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
      link: "/dashboard/configuracoes",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">
            {getGreeting()}, {data.userName}! 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {data.church ? `${data.church.name} · ` : ""}{todayCap}
          </p>
        </div>
        <Link
          href="/dashboard/comunicados"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-all"
        >
          <Bell className="w-4 h-4" />
          Enviar comunicado
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const inner = (
            <>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.link ? "text-amber-400 hover:text-amber-300" : "text-white/40"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
            </>
          );
          return stat.link ? (
            <Link key={stat.label} href={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
              >
                {inner}
              </motion.div>
            </Link>
          ) : (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} overflow-hidden`}
            >
              {inner}
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Member growth chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Crescimento de Membros</h3>
              <p className="text-xs text-white/40">Total atual</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {loading ? "—" : `${data.memberCount} membros`}
            </span>
          </div>
          {!loading && data.memberCount === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-white/20">
              <Users className="w-8 h-8 mb-2" />
              <p className="text-xs">Nenhum membro cadastrado ainda</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={[
                { mes: "Início", membros: 0 },
                { mes: "Hoje", membros: data.memberCount },
              ]}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="mes" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="membros" stroke="#7c3aed" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Check-ins chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Check-ins da Semana</h3>
            <p className="text-xs text-white/40">Dados em tempo real</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={emptyCheckinsData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Próximos Eventos</h3>
            <Link href="/dashboard/eventos" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : data.upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Nenhum evento próximo</p>
              <Link href="/dashboard/eventos/novo" className="mt-3 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                <Plus className="w-3 h-3" />Criar evento
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {data.upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-violet-400 font-medium leading-none">{formatDate(ev.start_date).split(" ")[1]?.toUpperCase()}</span>
                    <span className="text-sm font-bold text-violet-300 leading-none">{formatDate(ev.start_date).split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                    <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.start_time.slice(0,5)}</span>
                      {ev.location && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" />{ev.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40 shrink-0">
                    <QrCode className="w-3 h-3" />
                    {ev.registered_count}{ev.capacity ? `/${ev.capacity}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Atividades Recentes</h3>
          <div className="flex flex-col items-center justify-center h-40 text-white/20">
            <Bell className="w-8 h-8 mb-2" />
            <p className="text-xs text-center">Nenhuma atividade recente.<br />As ações aparecerão aqui.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
