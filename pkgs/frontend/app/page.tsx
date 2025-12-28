import CarSearch from "./components/CarSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            車両検索システム
          </h1>
          <p className="text-gray-600">
            ナンバープレートで車両情報と不具合履歴を検索
          </p>
        </header>

        <main>
          <CarSearch />
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Powered by AWS AppSync + DynamoDB + Next.js</p>
        </footer>
      </div>
    </div>
  );
}
