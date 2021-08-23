import { useEffect, useState } from 'react';

import styles from './Map.module.css';

import { initMapbox, updateLayers } from '../map';

const Map: React.FC<{ filters: Record<string, any> }> = ({ filters }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initMapbox(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      updateLayers(filters);
    }
  }, [filters, loaded]);

  return <section id="map" className={styles.map} />;
};

export default Map;
