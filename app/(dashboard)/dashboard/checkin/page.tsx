"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Search, CheckCircle2, Clock, Users, TrendingUp, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
  checkedIn?: boolean;
  checkinTime?: string;
};

function QRDisplay({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(`churchconnect:checkin:${memberId}`, {
          width: 200,
          margin: 2,
          color: { dark: "#ffffff", light: "#0d0d1f" },
        });
        setQrDataUrl(url);
      } catch {}
    }
    generate();
  }, [memberId]);

  return (
    <div className="text-center">
      {qrDataUrl ? (
        <img src={qrDataUrl} alt={`QR Code de ${memberName}`} className="w-48 h-48 mx-auto rounded-xl" />
      ) : (
        <div className="w-48 h-48 mx-auto rounded-xl bg-white/5 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      )}
      <p className="text-xs text-white/30 mt-3 font-mono break-all px-4">ID: {memberId.slice(0, 16)}...</p>
    </div>
  );
}

export default function CheckinPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qrMember, setQrMember] = useState<Member | null>(null);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: church } = await supabase.from("churches").select("id").eq("owner_id", user.id).single();
      if (!church) { setLoading(false); return; }
      const { data } = await supabase
        .from("members")
        .select("id, name, role, is_active")
        .eq("church_id", church.id)
        .eq("is_active", true)
        .order("name");
      setMembers((data || []).map((m) => ({ ...m, checkedIn: false })));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const checkedInCount = members.filter((m) => m.checkedIn).length;

  function handleCheckin(id: string) {
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, checkedIn: true, checkinTime: now } : m));
  }

  const stats = [
    { label: "Check-ins hoje", value: checkedInCount, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Aguardando", value: members.length - checkedInCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "Total membros", value: members.length, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    {
      label: "Taxa presença",
      value: members.length > 0 ? `${Math.round((checkedInCount / members.length) * 100)}%` : "0%",
      icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-black text-white">Check-in</h1>
          <p className="text-white/50 text-sm mt-0.5">Confirme a presença dos membros nos eventos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-4 rounded-2xl border", stat.bg)}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className={cn("text-2xl font-black", stat.color)}>{loading ? "—" : stat.value}</p>
            <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + list */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar membro..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{members.length === 0 ? "Nenhum membro cadastrado" : "Nenhum resultado"}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((member) => (
              <div key={member.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                  <p className="text-xs text-white/40 capitalize">{member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQrMember(member)}
                    title="Ver QR Code"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  {member.checkedIn ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">{member.checkinTime}</span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Presente
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckin(member.id)}
                      className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/20 text-violet-300 text-xs font-semibold transition-all"
                    >
                      Fazer check-in
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center relative"
            >
              <button
                onClick={() => setQrMember(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-300 mx-auto mb-3">
                {qrMember.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-poppins text-lg font-bold text-white mb-1">{qrMember.name}</h3>
              <p className="text-white/40 text-xs mb-6 capitalize">{qrMember.role}</p>
              <QRDisplay memberId={qrMember.id} memberName={qrMember.name} />
              <p className="text-white/30 text-xs mt-6">
                Apresente este QR Code no check-in dos eventos
              </p>
              {!qrMember.checkedIn && (
                <button
                  onClick={() => { handleCheckin(qrMember.id); setQrMember(null); }}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-bold text-white transition-all"
                >
                  Confirmar presença
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
