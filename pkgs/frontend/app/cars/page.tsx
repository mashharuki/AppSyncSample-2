import CarList from "../components/CarList";
import { ArrowLeft, Car } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "全車両一覧 | 車両検索システム",
  description: "登録されている全車両の一覧",
};

export default function CarsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg
                     hover:bg-white/10 transition-all duration-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">検索ページに戻る</span>
          </Link>

          {/* Main content */}
          <main>
            <CarList />
          </main>
        </div>
      </div>
    </div>
  );
}
