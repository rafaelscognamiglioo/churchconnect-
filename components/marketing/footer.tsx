import Link from "next/link";
import { Zap, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  Produto: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Planos", href: "/planos" },
    { label: "Como funciona", href: "/como-funciona" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Parceiros", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Suporte: [
    { label: "Central de ajuda", href: "#" },
    { label: "Documentação", href: "#" },
    { label: "Status", href: "#" },
    { label: "Comunidade", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de uso", href: "#" },
    { label: "LGPD", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[#080812] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-poppins font-bold text-lg">
                <span className="text-white">Church</span>
                <span className="text-gradient">Connect</span>
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              O hub completo para conectar sua igreja. Gerencie eventos, membros e experiências em um só lugar.
            </p>

            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#", name: "instagram" },
                { Icon: Twitter, href: "#", name: "twitter" },
                { Icon: Youtube, href: "#", name: "youtube" },
                { Icon: Mail, href: "#", name: "mail" },
              ].map(({ Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2025 ChurchConnect. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/30">
            <span>Feito com</span>
            <span className="text-red-400">♥</span>
            <span>para igrejas do Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
