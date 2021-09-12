import { useEffect } from 'react';

import styles from './Map.module.css';

import { getMapbox, initMapbox, MapboxAPI } from '../map';

import type { State } from '../reducer';

const Map: React.FC<{
  mapContainerRef: React.MutableRefObject<HTMLElement | null>;
  filters: State['filters'];
  center: State['center'];
  zoom: State['zoom'];
  selected: State['selected']['tree'];
  updateHover: (hovered: State['hovered']) => void;
  updateMap: (center: State['center'], zoom: State['zoom']) => void;
  updateSelected: (selected: State['selected']) => void;
}> = ({
  mapContainerRef,
  filters,
  center,
  zoom,
  selected,
  updateHover,
  updateMap,
  updateSelected,
}) => {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => initMapbox(center, zoom, selected), []);

  useEffect(() => {
    getMapbox().then(({ updateLayers }: MapboxAPI) => updateLayers(filters));
  }, [filters]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      onEvent('mousemove', updateHover);
    });
  }, [updateHover]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      onEvent('click', selected, updateSelected);
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [updateSelected]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      onEvent('idle', updateMap);
    });
  }, [updateMap]);

  return <section ref={mapContainerRef} id="map" className={styles.map} />;
};

export default Map;
