"use client";

import { Bell } from "lucide-react";

export default function NotificacoesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-poppins text-2xl font-black text-white">Notificações</h1>
        <p className="text-white/40 text-sm mt-0.5">Suas alertas e atualizações</p>
      </div>

      <div className="text-center py-20 text-white/30">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-7 h-7 opacity-40" />
        </div>
        <p className="text-sm font-medium text-white/50 mb-1">Nenhuma notificação</p>
        <p className="text-xs">As notificações sobre sua igreja aparecerão aqui.</p>
      </div>
    </div>
  );
}
