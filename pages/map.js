import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlcnJla2VnZ3MiLCJhIjoiY2ttYzM3YXV4MDJhZjJ3bzI1OXZxcnVrYiJ9.yCQrhJXH6jX2Aj2I0R7njg'; // replace w/ yours if needed

export default function PropertyMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch properties
    fetch('/api/property-feed')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
      });
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.935242, 40.730610], // Default NYC
      zoom: 10,
    });
  }, [mapContainer]);

  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    properties.forEach((property) => {
      const { mailing_address, owners = [], tax_assessor_id, longitude, latitude } = property;

      if (!longitude || !latitude) return;

      const popupContent = `
        <strong>Address:</strong> ${mailing_address || 'N/A'}<br/>
        <strong>Owner:</strong> ${owners.map(o => o.owner_name).join(', ') || 'Unknown'}<br/>
        <strong>ID:</strong> ${tax_assessor_id}
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      new mapboxgl.Marker({ color: '#111' })
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [properties]);

  return (
    <div className="w-screen h-screen">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
