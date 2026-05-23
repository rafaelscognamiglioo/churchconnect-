"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Plus, Search, Mail, Phone, MoreHorizontal,
  UserCheck, UserX, Crown, ChevronDown, Users, X, Loader2
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  joined_at: string;
  is_active: boolean;
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-indigo-500 to-violet-600",
  "from-red-500 to-rose-600",
];

const roleConfig: Record<string, { label: string; color: string }> = {
  membro: { label: "Membro", color: "bg-white/10 text-white/60" },
  lider: { label: "Líder", color: "bg-blue-500/20 text-blue-400" },
  diacono: { label: "Diácono", color: "bg-green-500/20 text-green-400" },
  presbítero: { label: "Presbítero", color: "bg-amber-500/20 text-amber-400" },
  pastor: { label: "Pastor", color: "bg-violet-500/20 text-violet-400" },
  admin: { label: "Admin", color: "bg-red-500/20 text-red-400" },
};

const ROLES = ["membro", "lider", "diacono", "presbítero", "pastor", "admin"];

type FormData = { name: string; email: string; phone: string; role: string };

export default function MembrosPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [churchId, setChurchId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", role: "membro" });

  const supabase = createSupabaseBrowserClient();

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: church } = await supabase.from("churches").select("id").eq("owner_id", user.id).single();
    if (!church) { setLoading(false); return; }
    setChurchId(church.id);
    const { data } = await supabase
      .from("members")
      .select("id, name, email, phone, role, joined_at, is_active")
      .eq("church_id", church.id)
      .order("joined_at", { ascending: false });
    setMembers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalActive = members.filter((m) => m.is_active).length;
  const totalLeaders = members.filter((m) => m.role === "lider" || m.role === "pastor").length;
  const thisMonth = members.filter((m) => {
    const d = new Date(m.joined_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!churchId || !form.name || !form.email) return;
    setSaving(true);
    await supabase.from("members").insert({
      church_id: churchId,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      role: form.role,
      is_active: true,
      joined_at: new Date().toISOString(),
    });
    setForm({ name: "", email: "", phone: "", role: "membro" });
    setShowAdd(false);
    setSaving(false);
    await load();
  }

  async function toggleActive(member: Member) {
    await supabase.from("members").update({ is_active: !member.is_active }).eq("id", member.id);
    setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, is_active: !m.is_active } : m));
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Membros</h1>
          <p className="text-white/50 text-sm mt-0.5">{loading ? "Carregando..." : `${members.length} membros cadastrados`}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white"
          >
            <Plus className="w-4 h-4" /> Novo Membro
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: members.length, color: "text-white" },
          { label: "Ativos", value: totalActive, color: "text-green-400" },
          { label: "Líderes", value: totalLeaders, color: "text-violet-400" },
          { label: "Novos mês", value: `+${thisMonth}`, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
            <div className={`text-2xl font-black font-poppins ${s.color}`}>
              {loading ? "—" : s.value}
            </div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 transition-all" />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white/70 focus:outline-none"
        >
          <option value="all" className="bg-[#0d0d1f]">Todos os cargos</option>
          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-[#0d0d1f]">{roleConfig[r]?.label || r}</option>
          ))}
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-white/30">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {members.length === 0 ? "Nenhum membro ainda. Adicione o primeiro!" : "Nenhum membro encontrado"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Membro</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Contato</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Cargo</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, idx) => {
                  const role = roleConfig[member.role] || { label: member.role, color: "bg-white/10 text-white/60" };
                  const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
                  const joined = new Date(member.joined_at);
                  const joinedStr = joined.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
                  return (
                    <tr key={member.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{member.name}</p>
                            <p className="text-xs text-white/40">Desde {joinedStr}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-white/50"><Mail className="w-3 h-3" />{member.email}</div>
                          {member.phone && <div className="flex items-center gap-1.5 text-xs text-white/50"><Phone className="w-3 h-3" />{member.phone}</div>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.color}`}>{role.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        {member.is_active ? (
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-xs text-green-400">Ativo</span></div>
                        ) : (
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><span className="text-xs text-white/40">Inativo</span></div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenu === member.id && (
                            <div className="absolute right-0 top-8 w-40 bg-[#0d0d1f] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10">
                              <button onClick={() => toggleActive(member)}
                                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${member.is_active ? "text-red-400" : "text-green-400"}`}>
                                {member.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                {member.is_active ? "Desativar" : "Ativar"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-sm text-white/40">Mostrando {filtered.length} de {members.length} membros</p>
          </div>
        )}
      </motion.div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-poppins text-lg font-bold text-white">Novo Membro</h2>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Nome completo *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="João Silva"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="joao@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Telefone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Cargo</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-[#0d0d1f]">{roleConfig[r]?.label || r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-bold text-white transition-all disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {saving ? "Salvando..." : "Adicionar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
