import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <div className="text-[10rem] font-black font-poppins leading-none select-none bg-gradient-to-b from-violet-500/30 to-transparent bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10rem] font-black font-poppins leading-none text-white/5 select-none">404</span>
          </div>
        </div>

        <h1 className="font-poppins text-2xl font-black text-white mb-3">
          Página não encontrada
        </h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-sm font-bold text-white"
          >
            <Home className="w-4 h-4" />
            Ir para o início
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
