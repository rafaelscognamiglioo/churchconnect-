import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, Calendar, Globe, Instagram, Mail, Building2, CheckCircle2 } from "lucide-react";

const planConfig: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "bg-white/10 text-white/50" },
  growth: { label: "Growth", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  revival: { label: "Revival", color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
  legacy: { label: "Legacy", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: church } = await supabase.from("churches").select("name, city, state").eq("slug", slug).single();
  if (!church) return { title: "Igreja não encontrada" };
  return { title: `${church.name} · ChurchConnect`, description: `${church.name} em ${church.city}, ${church.state}` };
}

export default async function ChurchProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: church } = await supabase
    .from("churches")
    .select("id, name, city, state, pastor_name, plan, verified, website, instagram, email, phone, description, created_at")
    .eq("slug", slug)
    .single();

  if (!church) notFound();

  const [membersRes, eventsRes] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }).eq("church_id", church.id).eq("is_active", true),
    supabase
      .from("events")
      .select("id, title, start_date, start_time, location, is_free, price, capacity, registered_count, category")
      .eq("church_id", church.id)
      .eq("status", "published")
      .gte("start_date", new Date().toISOString().split("T")[0])
      .order("start_date", { ascending: true })
      .limit(6),
  ]);

  const memberCount = membersRes.count || 0;
  const events = eventsRes.data || [];
  const cfg = planConfig[church.plan] || planConfig.starter;
  const initials = church.name.substring(0, 2).toUpperCase();
  const since = new Date(church.created_at).getFullYear();

  return (
    <div className="min-h-screen bg-[#080812]">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-16">
        <div className="h-40 bg-gradient-to-r from-violet-900/50 via-purple-900/40 to-indigo-900/50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-14 flex items-end gap-5 pb-6 border-b border-white/5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-3xl font-black text-white border-4 border-[#080812] shrink-0">
              {initials}
            </div>
            <div className="pb-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-poppins text-2xl font-black text-white">{church.name}</h1>
                {church.verified && (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verificada
                  </span>
                )}
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
              {church.pastor_name && (
                <p className="text-white/50 text-sm mt-0.5">Pastoreada por {church.pastor_name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Membros ativos", value: memberCount.toLocaleString("pt-BR"), icon: Users, color: "text-violet-400" },
                { label: "Eventos", value: events.length.toString(), icon: Calendar, color: "text-blue-400" },
                { label: "Desde", value: since.toString(), icon: Building2, color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {church.description && (
              <div>
                <h2 className="font-poppins text-lg font-bold text-white mb-3">Sobre a Igreja</h2>
                <p className="text-white/60 text-sm leading-relaxed">{church.description}</p>
              </div>
            )}

            {/* Upcoming events */}
            <div>
              <h2 className="font-poppins text-lg font-bold text-white mb-4">Próximos Eventos</h2>
              {events.length === 0 ? (
                <div className="text-center py-10 text-white/30 border border-dashed border-white/10 rounded-2xl">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum evento próximo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => {
                    const date = new Date(event.start_date + "T00:00:00");
                    return (
                      <Link
                        key={event.id}
                        href={`/eventos/${event.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/30 hover:bg-white/[0.05] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] text-violet-400 uppercase font-semibold leading-none">
                            {date.toLocaleDateString("pt-BR", { month: "short" })}
                          </span>
                          <span className="text-base font-black text-white leading-none mt-0.5">
                            {date.getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {event.start_time && (
                              <span className="text-xs text-white/40">{event.start_time.slice(0, 5)}</span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1 text-xs text-white/40">
                                <MapPin className="w-3 h-3" />{event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {event.is_free ? (
                            <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                              Gratuito
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-white/60 bg-white/5 px-2.5 py-1 rounded-full">
                              R$ {event.price}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-3">
              <h3 className="text-sm font-semibold text-white mb-4">Contato</h3>
              {church.city && (
                <div className="flex items-center gap-2.5 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                  {church.city}, {church.state}
                </div>
              )}
              {church.email && (
                <a href={`mailto:${church.email}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-violet-300 transition-colors">
                  <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                  {church.email}
                </a>
              )}
              {church.website && (
                <a href={church.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-violet-300 transition-colors">
                  <Globe className="w-4 h-4 text-violet-400 shrink-0" />
                  {church.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {church.instagram && (
                <a href={`https://instagram.com/${church.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-violet-300 transition-colors">
                  <Instagram className="w-4 h-4 text-violet-400 shrink-0" />
                  {church.instagram}
                </a>
              )}
              {!church.email && !church.website && !church.instagram && (
                <p className="text-xs text-white/30">Nenhum contato cadastrado</p>
              )}
            </div>

            {/* CTA */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20">
              <p className="text-sm font-semibold text-white mb-1">Quer sua própria página?</p>
              <p className="text-xs text-white/50 mb-4">Crie sua conta gratuita e comece a gerenciar sua comunidade.</p>
              <Link href="/registro" className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white">
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
