"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";

export function DashboardHeader() {
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("PR");
  const [userRole, setUserRole] = useState("Administrador");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Pastor";
      setUserName(name);
      setUserInitials(name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase());
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a1b]/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-xs relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Buscar eventos, membros..."
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/dashboard/notificacoes"
          className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <Bell className="w-4 h-4 text-white/60" />
        </Link>

        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <Link href="/dashboard/configuracoes">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:opacity-80 transition-opacity">
              {userInitials}
            </div>
          </Link>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white truncate max-w-[120px]">{userName || "Carregando..."}</p>
            <p className="text-xs text-white/40">{userRole}</p>
          </div>
          <button onClick={handleLogout} title="Sair" className="text-white/30 hover:text-red-400 transition-colors ml-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
