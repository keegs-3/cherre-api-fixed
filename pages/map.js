import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE'; // Replace with your real token

export default function ZillowModeMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [allProperties, setAllProperties] = useState([]);
  const [visibleProperties, setVisibleProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [markerMap, setMarkerMap] = useState({});

  useEffect(() => {
    fetch('/api/property-feed')
      .then((res) => res.json())
      .then((data) => {
        setAllProperties(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.935242, 40.73061],
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.on('load', updateVisibleProperties);
    map.current.on('moveend', updateVisibleProperties);
  }, []);

  const updateVisibleProperties = () => {
    if (!map.current || !allProperties.length) return;

    const bounds = map.current.getBounds();

    const visible = allProperties.filter((p) => {
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      if (!lat || !lng) return false;

      return (
        lng >= bounds.getWest() &&
        lng <= bounds.getEast() &&
        lat >= bounds.getSouth() &&
        lat <= bounds.getNorth()
      );
    });

    setVisibleProperties(visible);
  };

  useEffect(() => {
    if (!map.current || !allProperties.length) return;

    const newMarkers = {};

    allProperties.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const marker = new mapboxgl.Marker({ color: '#111' })
        .setLngLat([parseFloat(p.longitude), parseFloat(p.latitude)])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${p.mailing_address || 'Unknown address'}</strong><br/>
            ${p.owners?.map((o) => o.owner_name).join(', ') || 'No owner listed'}
          `)
        )
        .addTo(map.current);

      newMarkers[p.tax_assessor_id] = marker;
    });

    setMarkerMap(newMarkers);
  }, [allProperties]);

  const handleFlyToProperty = (property) => {
    const { latitude, longitude, tax_assessor_id } = property;
    if (!map.current || !latitude || !longitude) return;

    map.current.flyTo({
      center: [parseFloat(longitude), parseFloat(latitude)],
      zoom: 15,
      essential: true,
    });

    // Open popup
    markerMap[tax_assessor_id]?.togglePopup();
  };

  const filteredProps = visibleProperties.filter((p) => {
    const target = `${p.mailing_address || ''} ${p.owners?.map((o) => o.owner_name).join(' ') || ''}`;
    const matchesSearch = target.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'recent' && p.last_sale_date?.includes('2022')) || // demo logic
      (selectedFilter === 'hasOwner' && p.owners?.length > 0);

    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'Sold in 2022' },
    { id: 'hasOwner', label: 'Has Owner' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <div ref={mapContainer} className="w-full md:w-2/3 h-1/2 md:h-full" />

      <div className="w-full md:w-1/3 h-1/2 md:h-full bg-white overflow-y-auto border-l p-4">
        <h2 className="text-xl font-semibold mb-2">🏠 Properties in View</h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-3 rounded"
          placeholder="Search by owner or address..."
        />

        <div className="flex gap-2 mb-4 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedFilter === opt.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => setSelectedFilter(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && filteredProps.length === 0 && (
          <p className="text-gray-500">No properties in view</p>
        )}

        <ul className="space-y-3">
          {filteredProps.map((p, i) => (
            <li
              key={i}
              onClick={() => handleFlyToProperty(p)}
              className="border p-3 rounded shadow-sm hover:bg-gray-100 cursor-pointer transition"
            >
              <p className="font-medium">{p.mailing_address || 'Unknown address'}</p>
              <p className="text-sm text-gray-500">
                {p.owners?.map((o) => o.owner_name).join(', ') || 'No owner data'}
              </p>
              <p className="text-xs text-gray-400">ID: {p.tax_assessor_id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
