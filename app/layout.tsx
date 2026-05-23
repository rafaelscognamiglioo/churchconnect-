import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ChurchConnect — O Hub Completo para sua Igreja",
    template: "%s | ChurchConnect",
  },
  description:
    "Gerencie eventos, membros e experiências da sua igreja em um único lugar. A plataforma SaaS mais moderna para igrejas do Brasil.",
  keywords: ["igreja", "eventos", "membros", "gestão", "SaaS", "aplicativo para igrejas"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://churchconnect.com.br",
    siteName: "ChurchConnect",
    title: "ChurchConnect — O Hub Completo para sua Igreja",
    description: "Gerencie eventos, membros e experiências da sua igreja em um único lugar.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          poppins.variable,
          "font-sans antialiased bg-[#080812] text-white min-h-screen"
        )}
      >
        {children}
      </body>
    </html>
  );
}
