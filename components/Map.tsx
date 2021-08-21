import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import styles from './Map.module.css';

const Map: React.FC = () => {
  const mapboxRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    mapboxRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-122.6, 45.5],
      zoom: 11,
    });
  }, []);

  return <section id="map" className={styles.map} />;
};

export default Map;
