import { useEffect } from 'react';

import styles from './Map.module.css';

import {
  getMapbox,
  initMapbox,
  interactiveLayers,
  MapboxAPI,
} from '../map';

import type { State } from '../reducer';

const Map: React.FC<{
  mapContainerRef: React.MutableRefObject<HTMLElement | null>,
  filters: State['filters'];
  updateHover: (hovered: State['hovered']) => void;
}> = ({ mapContainerRef, filters, updateHover }) => {
  useEffect(initMapbox, []);

  useEffect(() => {
    getMapbox().then(({ updateLayers }: MapboxAPI) => updateLayers(filters));
  }, [filters]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      onEvent('mousemove', (evt) => {
        const {
          point: { x, y },
          target: map,
        } = evt;
        const features = map.queryRenderedFeatures(
          [
            [x - 5, y - 5],
            [x + 5, y + 5],
          ],
          { layers: interactiveLayers },
        );

        updateHover(features?.[0] ?? null);
      });
    });
  }, [updateHover]);

  return <section ref={mapContainerRef} id="map" className={styles.map} />;
};

export default Map;
