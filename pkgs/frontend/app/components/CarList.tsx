"use client";

import { useState, useEffect } from "react";
import type { ListCarsQuery } from "@/lib/graphql/generated";
import { generateClient } from "@/lib/graphql-client";
import { LIST_CARS } from "@/lib/graphql/queries";
import {
  Car,
  Loader2,
  AlertCircle,
  Calendar,
  Palette,
  Settings,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const client = generateClient();

type Car = NonNullable<NonNullable<ListCarsQuery["listCars"]>["items"]>[number];

export default function CarList() {
  const [cars, setCars] = useState<NonNullable<Car>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCars = async (token?: string | null) => {
    const isInitialLoad = !token;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const result = await client.graphql({
        query: LIST_CARS,
        variables: { limit: 20, nextToken: token },
      });

      const data = (result as any).data as ListCarsQuery;
      const errors = (result as any).errors as
        | Array<{ message: string }>
        | undefined;

      if (errors) {
        setError(errors.map((e) => e.message).join(", "));
      } else if (data?.listCars?.items) {
        const newItems = data.listCars.items.filter((item) => item !== null);
        if (isInitialLoad) {
          setCars(newItems);
        } else {
          setCars((prev) => [...prev, ...newItems]);
        }
        setNextToken(data.listCars.nextToken || null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの取得に失敗しました",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
          <p className="text-gray-400">車両データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/20 bg-red-500/10 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold mb-1">エラー</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Car className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">全車両一覧</h2>
              <p className="text-gray-400 text-sm">
                登録されている車両: {cars.length}台
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <Link
            key={car?.licenseplate || index}
            href={`/?search=${car?.licenseplate}`}
            className="group glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl
                     hover:border-blue-500/50 transition-all duration-300
                     hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105
                     cursor-pointer"
          >
            <div className="space-y-4">
              {/* License Plate */}
              <div className="flex items-center justify-between">
                <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
                  <span className="text-blue-300 font-bold text-lg">
                    {car?.licenseplate || "不明"}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>

              {/* Car Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">ブランド</p>
                    <p className="text-white font-semibold">
                      {car?.brand || "-"}
                    </p>
                  </div>
                </div>

                {car?.tradename && (
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">商品名</p>
                      <p className="text-white font-semibold">
                        {car.tradename}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">色</p>
                    <p className="text-white font-semibold">
                      {car?.firstcolor || "-"}
                    </p>
                  </div>
                </div>

                {car?.firstregistrationdate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">初回登録日</p>
                      <p className="text-white font-semibold">
                        {car.firstregistrationdate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {nextToken && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => fetchCars(nextToken)}
            disabled={loadingMore}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600
                     text-white font-semibold rounded-xl
                     hover:from-blue-600 hover:to-blue-700
                     disabled:from-gray-600 disabled:to-gray-700
                     disabled:cursor-not-allowed
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300
                     shadow-lg hover:shadow-blue-500/50
                     flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                読み込み中...
              </>
            ) : (
              <>さらに読み込む</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
