"use client";

import { useState } from "react";
import type { GetCarQuery } from "@/lib/graphql/generated";
import { generateClient } from "@/lib/graphql-client";
import { GET_CAR } from "@/lib/graphql/queries";
import {
  Search,
  Car,
  AlertCircle,
  Loader2,
  Calendar,
  Palette,
  Gauge,
  CreditCard,
  Ruler,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const client = generateClient();

export default function CarSearch() {
  const [licenseplate, setLicenseplate] = useState("");
  const [carData, setCarData] = useState<GetCarQuery["getCar"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseplate.trim()) return;

    setLoading(true);
    setError(null);
    setCarData(null);

    try {
      const result = await client.graphql({
        query: GET_CAR,
        variables: { licenseplate: licenseplate.trim() },
      });

      const data = (result as any).data as GetCarQuery;
      const errors = (result as any).errors as
        | Array<{ message: string }>
        | undefined;

      if (errors) {
        setError(errors.map((e) => e.message).join(", "));
      } else if (data?.getCar) {
        setCarData(data.getCar);
      } else {
        setError("車両が見つかりませんでした");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの取得に失敗しました",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={licenseplate}
                onChange={(e) => setLicenseplate(e.target.value)}
                placeholder="ナンバープレートを入力 (例: BR794ZQ3)"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
                         transition-all duration-300
                         hover:bg-white/10"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white font-semibold rounded-xl
                       hover:from-blue-600 hover:to-blue-700
                       disabled:from-gray-600 disabled:to-gray-700 
                       disabled:cursor-not-allowed
                       transform hover:scale-105 active:scale-95
                       transition-all duration-300
                       shadow-lg hover:shadow-blue-500/50
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  検索中...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  検索
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="glass rounded-2xl p-6 border border-red-500/20 bg-red-500/10 
                      backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">エラー</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Car Data */}
      {carData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Vehicle Info Card */}
          <div className="glass rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Car className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">車両情報</h2>
                  <p className="text-gray-400 text-sm">Vehicle Information</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                  icon={<Car className="w-5 h-5" />}
                  label="ナンバープレート"
                  value={carData.licenseplate}
                  highlight
                />
                <InfoCard
                  icon={<Settings className="w-5 h-5" />}
                  label="ブランド"
                  value={carData.brand}
                />
                <InfoCard
                  icon={<Car className="w-5 h-5" />}
                  label="商品名"
                  value={carData.tradename}
                />
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="初回登録日"
                  value={carData.firstregistrationdate}
                />
                <InfoCard
                  icon={<CheckCircle className="w-5 h-5" />}
                  label="車検有効期限"
                  value={carData.expirydateapk}
                />
                <InfoCard
                  icon={<Palette className="w-5 h-5" />}
                  label="色"
                  value={carData.firstcolor}
                />
                <InfoCard
                  icon={<Gauge className="w-5 h-5" />}
                  label="シリンダー数"
                  value={carData.cylindercount}
                />
                <InfoCard
                  icon={<Gauge className="w-5 h-5" />}
                  label="排気量"
                  value={carData.cylindervolume}
                />
                <InfoCard
                  icon={<CreditCard className="w-5 h-5" />}
                  label="カタログ価格"
                  value={carData.catalogprice}
                />
                <InfoCard
                  icon={<Ruler className="w-5 h-5" />}
                  label="長さ"
                  value={carData.length}
                />
                <InfoCard
                  icon={<Ruler className="w-5 h-5" />}
                  label="幅"
                  value={carData.width}
                />
              </div>
            </div>
          </div>

          {/* Defects Card */}
          {carData.defects && carData.defects.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <AlertTriangle className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        不具合履歴
                      </h3>
                      <p className="text-gray-400 text-sm">Defect History</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-orange-500/20 rounded-full">
                    <span className="text-orange-400 font-bold">
                      {carData.defects.length}件
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                {carData.defects.map((defect, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-white/5 border border-white/10 rounded-xl
                             hover:bg-white/10 hover:border-orange-500/50
                             transition-all duration-300
                             hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                        <Calendar className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-orange-400">
                            発生日: {defect?.defectstartdate || "不明"}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                          {defect?.defectdescription || "説明なし"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group p-5 rounded-xl border transition-all duration-300
                  ${
                    highlight
                      ? "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }
                  hover:shadow-lg hover:scale-105`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg transition-colors ${
            highlight
              ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
              : "bg-white/10 text-gray-400 group-hover:bg-white/20"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <dt className="text-xs font-medium text-gray-400 mb-1">{label}</dt>
          <dd
            className={`text-base font-semibold truncate ${
              highlight ? "text-blue-300" : "text-white"
            }`}
          >
            {value || "-"}
          </dd>
        </div>
      </div>
    </div>
  );
}