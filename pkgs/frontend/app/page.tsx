import CarSearch from "./components/CarSearch";
import { Car, Sparkles, List } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass mb-6 animate-glow">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Powered by AWS AppSync</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              <span className="inline-block hover:scale-105 transition-transform">
                車両検索システム
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl text-gray-300">
              <Car className="w-8 h-8 text-blue-400" />
              <p>ナンバープレートで車両情報と不具合履歴を検索</p>
            </div>

            {/* Link to All Cars */}
            <div className="pt-4">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl
                         hover:bg-white/10 transition-all duration-300
                         border border-white/10 hover:border-blue-500/50
                         group"
              >
                <List className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-semibold">全車両を見る</span>
              </Link>
            </div>
          </header>

          {/* Main content */}
          <main className="mb-16">
            <CarSearch />
          </main>

          {/* Footer */}
          <footer className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  AWS AppSync
                </span>
                <span className="text-gray-600">•</span>
                <span>DynamoDB</span>
                <span className="text-gray-600">•</span>
                <span>Next.js 16</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
