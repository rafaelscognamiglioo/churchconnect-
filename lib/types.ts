export type Plan = "starter" | "growth" | "revival" | "legacy";

export interface Church {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  pastor_name?: string;
  member_count?: number;
  plan: Plan;
  verified: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  church_id: string;
  church?: Church;
  title: string;
  slug: string;
  description?: string;
  banner_url?: string;
  category: EventCategory;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  address?: string;
  is_online: boolean;
  meeting_url?: string;
  capacity?: number;
  registered_count: number;
  is_free: boolean;
  price?: number;
  status: "draft" | "published" | "cancelled" | "finished";
  requires_checkin: boolean;
  created_at: string;
}

export type EventCategory =
  | "culto"
  | "celula"
  | "conferencia"
  | "congresso"
  | "retiro"
  | "imersao"
  | "jovens"
  | "acampamento"
  | "encontro"
  | "curso"
  | "escola-biblica"
  | "batismo"
  | "vigilia"
  | "especial"
  | "outro";

export interface Member {
  id: string;
  church_id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "member" | "leader" | "deacon" | "elder" | "pastor" | "admin";
  joined_at: string;
  is_active: boolean;
}

export interface Registration {
  id: string;
  event_id: string;
  event?: Event;
  member_id: string;
  member?: Member;
  status: "pending" | "confirmed" | "cancelled" | "checked_in";
  qr_code?: string;
  registered_at: string;
  checked_in_at?: string;
}

export interface DashboardStats {
  total_members: number;
  active_events: number;
  total_registrations: number;
  monthly_growth: number;
  checkins_today: number;
  upcoming_events: number;
}

export const EVENT_CATEGORIES: Record<EventCategory, { label: string; color: string; icon: string }> = {
  culto: { label: "Culto", color: "bg-blue-500/20 text-blue-400", icon: "🙏" },
  celula: { label: "Célula", color: "bg-green-500/20 text-green-400", icon: "👥" },
  conferencia: { label: "Conferência", color: "bg-purple-500/20 text-purple-400", icon: "🎤" },
  congresso: { label: "Congresso", color: "bg-red-500/20 text-red-400", icon: "🏛️" },
  retiro: { label: "Retiro", color: "bg-amber-500/20 text-amber-400", icon: "⛺" },
  imersao: { label: "Imersão", color: "bg-cyan-500/20 text-cyan-400", icon: "💧" },
  jovens: { label: "Jovens", color: "bg-pink-500/20 text-pink-400", icon: "🔥" },
  acampamento: { label: "Acampamento", color: "bg-lime-500/20 text-lime-400", icon: "🏕️" },
  encontro: { label: "Encontro", color: "bg-violet-500/20 text-violet-400", icon: "💫" },
  curso: { label: "Curso", color: "bg-orange-500/20 text-orange-400", icon: "📚" },
  "escola-biblica": { label: "Escola Bíblica", color: "bg-teal-500/20 text-teal-400", icon: "📖" },
  batismo: { label: "Batismo", color: "bg-sky-500/20 text-sky-400", icon: "💦" },
  vigilia: { label: "Vigília", color: "bg-indigo-500/20 text-indigo-400", icon: "🌙" },
  especial: { label: "Especial", color: "bg-yellow-500/20 text-yellow-400", icon: "⭐" },
  outro: { label: "Outro", color: "bg-gray-500/20 text-gray-400", icon: "📌" },
};

export const PLANS: Record<Plan, {
  name: string;
  price: number;
  description: string;
  members: number | "unlimited";
  events: number | "unlimited";
  features: string[];
  highlight?: boolean;
}> = {
  starter: {
    name: "Starter",
    price: 0,
    description: "Para igrejas que estão começando",
    members: 50,
    events: 5,
    features: [
      "Até 50 membros",
      "5 eventos por mês",
      "Página institucional básica",
      "Lista de presença",
      "Suporte por email",
    ],
  },
  growth: {
    name: "Growth",
    price: 97,
    description: "Para igrejas em crescimento",
    members: 300,
    events: 30,
    features: [
      "Até 300 membros",
      "30 eventos por mês",
      "QR Code para check-in",
      "Integração WhatsApp",
      "Analytics básico",
      "Página institucional completa",
      "Suporte prioritário",
    ],
  },
  revival: {
    name: "Revival",
    price: 197,
    description: "Para igrejas estabelecidas",
    members: 1000,
    events: "unlimited",
    features: [
      "Até 1.000 membros",
      "Eventos ilimitados",
      "QR Code avançado",
      "WhatsApp automático",
      "Analytics avançado",
      "Upload de mídias",
      "Múltiplos admins",
      "Relatórios completos",
      "Suporte VIP",
    ],
    highlight: true,
  },
  legacy: {
    name: "Legacy",
    price: 397,
    description: "Para redes de igrejas",
    members: "unlimited",
    events: "unlimited",
    features: [
      "Membros ilimitados",
      "Eventos ilimitados",
      "Multi-igrejas (rede)",
      "API access",
      "White-label",
      "Integração app mobile",
      "Dashboard rede",
      "Gerente de conta dedicado",
      "SLA garantido",
      "Onboarding personalizado",
    ],
  },
};
