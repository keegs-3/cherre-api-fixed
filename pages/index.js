export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-4">🏡 Welcome to the Cherre API Viewer</h1>
      <p className="text-lg text-gray-700 mb-6">
        Choose a view below to get started.
      </p>
      <div className="space-x-4">
        <a
          href="/map"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          🗺️ Go to Map View
        </a>
        <a
          href="/view"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          📝 Go to List View
        </a>
      </div>
    </main>
  );
}
