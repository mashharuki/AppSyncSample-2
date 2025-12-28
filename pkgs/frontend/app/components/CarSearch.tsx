"use client";

import { useState } from "react";
import type { GetCarQuery } from "@/lib/graphql/generated";
import { generateClient } from "@/lib/graphql-client";
import { GET_CAR } from "@/lib/graphql/queries";

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
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={licenseplate}
            onChange={(e) => setLicenseplate(e.target.value)}
            placeholder="ナンバープレートを入力 (例: BR794ZQ3)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "検索中..." : "検索"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {carData && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">車両情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="ナンバープレート" value={carData.licenseplate} />
              <InfoItem label="ブランド" value={carData.brand} />
              <InfoItem label="商品名" value={carData.tradename} />
              <InfoItem
                label="初回登録日"
                value={carData.firstregistrationdate}
              />
              <InfoItem label="車検有効期限" value={carData.expirydateapk} />
              <InfoItem label="色" value={carData.firstcolor} />
              <InfoItem label="シリンダー数" value={carData.cylindercount} />
              <InfoItem label="排気量" value={carData.cylindervolume} />
              <InfoItem label="カタログ価格" value={carData.catalogprice} />
              <InfoItem label="長さ" value={carData.length} />
              <InfoItem label="幅" value={carData.width} />
            </div>
          </div>

          {carData.defects && carData.defects.length > 0 && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                不具合履歴 ({carData.defects.length}件)
              </h3>
              <div className="space-y-3">
                {carData.defects.map((defect, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        発生日: {defect?.defectstartdate || "不明"}
                      </span>
                    </div>
                    <p className="text-gray-900">
                      {defect?.defectdescription || "説明なし"}
                    </p>
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

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "-"}</dd>
    </div>
  );
}
