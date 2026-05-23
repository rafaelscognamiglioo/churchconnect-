"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, Building2, Users, DollarSign, Settings, ExternalLink, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/admin" },
  { icon: Building2, label: "Igrejas", href: "/admin/igrejas" },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: DollarSign, label: "Receita", href: "/admin/receita" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex flex-col h-screen bg-[#06060f] border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-14 px-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shrink-0">
          <Shield className="w-3.5 h-3.5 text-white" fill="white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white leading-none">ChurchConnect</p>
          <p className="text-[10px] text-red-400 font-semibold leading-none mt-0.5">SUPER ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm",
                active
                  ? "bg-red-500/10 border border-red-500/20 text-red-300"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-red-400" : "")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <Zap className="w-4 h-4" />
          <span className="font-medium">Ir ao Dashboard</span>
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Link>
        <Link
          href="/admin/configuracoes"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium">Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
