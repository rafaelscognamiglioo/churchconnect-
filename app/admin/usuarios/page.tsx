"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mail, Building2, Calendar } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined_at: string;
  is_active: boolean;
  church_name?: string;
};

const roleColors: Record<string, string> = {
  admin: "text-red-400 bg-red-500/10 border-red-500/20",
  pastor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  lider: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  membro: "text-white/50 bg-white/5 border-white/10",
};

const roleLabels: Record<string, string> = {
  admin: "Admin", pastor: "Pastor", lider: "Líder", membro: "Membro",
};

export default function AdminUsuariosPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("members")
        .select("id, name, email, role, joined_at, is_active, church_id, churches(name)")
        .order("joined_at", { ascending: false })
        .limit(100);

      if (data) {
        setMembers(data.map((m: any) => ({ ...m, church_name: m.churches?.name })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.church_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = members.filter((m) => m.is_active).length;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-poppins text-2xl font-black text-white">Usuários</h1>
        <p className="text-white/40 text-sm mt-0.5">
          {members.length} usuários · {totalActive} ativos
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: members.length, color: "text-white" },
          { label: "Ativos", value: totalActive, color: "text-green-400" },
          { label: "Pastores", value: members.filter(m => m.role === "pastor").length, color: "text-violet-400" },
          { label: "Líderes", value: members.filter(m => m.role === "lider").length, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, email ou igreja..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-white/30 uppercase tracking-wider">
          <div className="col-span-3">Nome</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Igreja</div>
          <div className="col-span-1 text-center">Cargo</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Data</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {loading ? (
            [1,2,3,4,5].map((i) => (
              <div key={i} className="h-14 mx-5 my-2 rounded-xl bg-white/5 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 text-white/30">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum usuário encontrado</p>
            </div>
          ) : (
            filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white truncate">{member.name}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-xs text-white/50">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-xs text-white/50">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{member.church_name || "—"}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roleColors[member.role] || roleColors.membro}`}>
                    {roleLabels[member.role] || member.role}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${member.is_active ? "bg-green-400" : "bg-white/20"}`} />
                </div>
                <div className="col-span-1 text-center">
                  <span className="flex items-center justify-center gap-1 text-xs text-white/30">
                    <Calendar className="w-3 h-3" />
                    {new Date(member.joined_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
