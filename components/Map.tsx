import type { GeoJSONSource } from 'mapbox-gl';
import { useEffect } from 'react';

import styles from './Map.module.css';

import { getMapbox, initMapbox, interactiveLayers, MapboxAPI } from '../map';

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
      let hoveredFeature: State['hovered'] = null;

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

        const source = map.getSource('hovered') as GeoJSONSource;
        let newHovered: State['hovered'] = null;

        features.forEach((feature) => {
          if (feature.layer.id !== 'equity') {
            newHovered = feature;
          }
        });

        if (!newHovered) {
          updateHover(null);
          if (hoveredFeature?.id) {
            source.setData({ type: 'FeatureCollection', features: [] });
          }
          hoveredFeature = null;
          return;
        }

        // @ts-ignore
        if (hoveredFeature && newHovered.id === hoveredFeature.id) {
          return;
        }

        hoveredFeature = newHovered;

        source.setData(newHovered);

        updateHover(newHovered);
      });
    });
  }, [updateHover]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      let selectedFeature: State['selected']['tree'] = selected;

      onEvent('click', (evt) => {
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

        const newSelected: State['selected'] = {
          tree: null,
          block: null,
        };

        features.forEach((feature) => {
          if (!newSelected.tree && feature.layer.id !== 'equity') {
            newSelected.tree = feature;
          }
          if (!newSelected.block && feature.layer.id === 'equity') {
            newSelected.block = feature;
          }
        });

        const source = map.getSource('selected') as GeoJSONSource;

        if (!newSelected.tree) {
          updateSelected(newSelected);
          if (selectedFeature?.id) {
            source.setData({ type: 'FeatureCollection', features: [] });
          }
          selectedFeature = null;
          return;
        }

        if (selectedFeature) {
          if (newSelected.tree.id === selectedFeature.id) {
            return;
          }
          source.setData({ type: 'FeatureCollection', features: [] });
        }

        selectedFeature = newSelected.tree;

        source.setData(newSelected.tree);

        updateSelected(newSelected);
      });
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [updateSelected]);

  useEffect(() => {
    getMapbox().then(({ onEvent }: MapboxAPI) => {
      onEvent('idle', ({ target: map }) => {
        const { lng, lat } = map.getCenter();
        updateMap([lng, lat], map.getZoom());
      });
    });
  }, [updateMap]);

  return <section ref={mapContainerRef} id="map" className={styles.map} />;
};

export default Map;
