import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Replace with your Mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export default function PropertyMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch properties with lat/lng
    fetch('/api/property-feed')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.935242, 40.730610], // Default: New York City
      zoom: 10,
    });

    // Add zoom and rotation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, [mapContainer]);

  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    // Create a new GeoJSON feature collection for clustering
    const geoJson = {
      type: 'FeatureCollection',
      features: properties.map((property) => {
        if (!property.latitude || !property.longitude) return null;
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(property.longitude), parseFloat(property.latitude)],
          },
          properties: {
            ...property,
          },
        };
      }).filter(Boolean), // Remove null entries
    };

    // Set up clustering
    map.current.addSource('properties', {
      type: 'geojson',
      data: geoJson,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster
      clusterRadius: 50,  // Distance between points to cluster
    });

    // Add a layer to display clusters
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'properties',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#51bbd6',
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,  // small cluster radius
          100, 30,  // medium cluster radius
          750, 40,  // large cluster radius
        ],
      },
    });

    // Add a layer for cluster count labels
    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'properties',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    // Add a layer to display non-clustered points
    map.current.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'properties',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#f28cb1',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Create popups for each property on click
    map.current.on('click', 'unclustered-point', (e) => {
      const properties = e.features[0].properties;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <strong>Address:</strong> ${properties.mailing_address || 'N/A'}<br/>
          <strong>Owner(s):</strong> ${properties.owners.map(o => o.owner_name).join(', ') || 'Unknown'}
        `)
        .addTo(map.current);
    });

    // Open popup for clusters on click
    map.current.on('click', 'clusters', (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      const clusterId = features[0].properties.cluster_id;
      map.current.getSource('properties').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
    });
  }, [properties]);

  return (
    <div className="relative w-screen h-screen">
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white text-xl">Loading properties...</div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

