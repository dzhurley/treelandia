import { useEffect } from 'react';

import styles from './Map.module.css';

import { initMapbox } from '../map';

const Map: React.FC = () => {
  useEffect(initMapbox, []);

  return <section id="map" className={styles.map} />;
};

export default Map;
