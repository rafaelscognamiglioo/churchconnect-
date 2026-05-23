import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side (browser / Client Components)
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Simple anon client (public reads, no cookie handling)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          instagram: string | null;
          whatsapp: string | null;
          pastor_name: string | null;
          plan: string;
          verified: boolean;
          owner_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["churches"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["churches"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          church_id: string;
          title: string;
          slug: string;
          description: string | null;
          banner_url: string | null;
          category: string;
          start_date: string;
          end_date: string | null;
          start_time: string;
          end_time: string | null;
          location: string | null;
          address: string | null;
          is_online: boolean;
          meeting_url: string | null;
          capacity: number | null;
          registered_count: number;
          is_free: boolean;
          price: number | null;
          status: string;
          requires_checkin: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "registered_count">;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      members: {
        Row: {
          id: string;
          church_id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          joined_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["members"]["Row"], "id" | "joined_at">;
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          status: string;
          qr_code: string | null;
          registered_at: string;
          checked_in_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["registrations"]["Row"], "id" | "registered_at">;
        Update: Partial<Database["public"]["Tables"]["registrations"]["Insert"]>;
      };
    };
  };
};
