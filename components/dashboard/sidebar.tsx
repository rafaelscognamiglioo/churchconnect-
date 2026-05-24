"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, LayoutDashboard, Calendar, Users, QrCode,
  BarChart3, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, Plus, Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Eventos", href: "/dashboard/eventos" },
  { icon: Users, label: "Membros", href: "/dashboard/membros" },
  { icon: QrCode, label: "Check-in", href: "/dashboard/checkin" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Megaphone, label: "Comunicados", href: "/dashboard/comunicados" },
  { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [churchName, setChurchName] = useState("");
  const [churchCity, setChurchCity] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("PR");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Pastor";
      setUserName(name.split(" ")[0]);
      setUserInitials(name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase());
      const { data: church } = await supabase.from("churches").select("name, city").eq("owner_id", user.id).single();
      if (church) { setChurchName(church.name); setChurchCity(church.city || ""); }
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-[#0a0a1b] border-r border-white/5 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-white/5 shrink-0", collapsed ? "justify-center" : "gap-2.5")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-poppins font-bold text-base whitespace-nowrap overflow-hidden"
            >
              <span className="text-white">Church</span>
              <span className="text-gradient">Connect</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Church name */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-white/5 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-300 shrink-0">
                {churchName ? churchName.substring(0, 2).toUpperCase() : "IG"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{churchName || "Minha Igreja"}</p>
                <p className="text-xs text-white/40 truncate">{churchCity || "Configure nas definições"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New event button */}
      <div className={cn("p-3 border-b border-white/5", collapsed ? "flex justify-center" : "")}>
        <Link
          href="/dashboard/eventos/novo"
          className={cn(
            "flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-semibold text-white",
            collapsed ? "w-10 h-10 justify-center" : "px-3 py-2.5 w-full"
          )}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Novo Evento</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-200 group",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
                active
                  ? "bg-violet-600/20 border border-violet-500/20 text-violet-300"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-violet-400" : "group-hover:text-white/80")} />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("p-3 border-t border-white/5 space-y-1", collapsed ? "flex flex-col items-center" : "")}>
        <Link
          href="/dashboard/notificacoes"
          className={cn(
            "flex items-center gap-3 rounded-xl transition-all text-white/50 hover:text-white hover:bg-white/5 relative",
            collapsed ? "justify-center w-10 h-10" : "px-3 py-2.5"
          )}
        >
          <Bell className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Notificações</span>}
        </Link>

        <div className={cn(
          "flex items-center gap-3 rounded-xl transition-all text-white/50 hover:text-white hover:bg-white/5",
          collapsed ? "justify-center w-10 h-10" : "px-3 py-2.5"
        )}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {userInitials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium text-white/80 truncate">{userName || "Usuário"}</p>
                <p className="text-[10px] text-white/40 truncate">Admin</p>
              </div>
              <button onClick={handleLogout} title="Sair" className="hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5 shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a0a1b] border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3 text-white/40" /> : <ChevronLeft className="w-3 h-3 text-white/40" />}
      </button>
    </motion.aside>
  );
}
