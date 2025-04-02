import { useState, useEffect } from 'react';

export default function PropertyViewer() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    const res = await fetch(`/api/property-feed?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏠 Property Feed Viewer V2</h1>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search by owner or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchProperties}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      {loading && <div className="text-gray-600 mb-2">Loading...</div>}

      <table className="w-full table-auto bg-white shadow rounded overflow-hidden text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Year Built</th>
            <th className="px-4 py-2">Last Sale</th>
            <th className="px-4 py-2">Owner(s)</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{p.mailing_address || 'N/A'}</td>
              <td className="px-4 py-2">{p.year_built || '—'}</td>
              <td className="px-4 py-2">{p.last_sale_date || '—'}</td>
              <td className="px-4 py-2">
                {(p.owners || []).map((o, idx) => (
                  <div key={idx}>
                    {o.owner_name} <span className="text-xs text-gray-500">({o.owner_type})</span>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
