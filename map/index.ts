import type MapboxGL from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { layers, getLayer } from './layers';

let map: MapboxGL.Map;

export const updateLayers = (filters: Record<string, any>): void => {
  Object.entries(filters).forEach(([name, value]) => {
    if ('street-trees' === name) {
      map.setFilter('even-street-trees', value);
      map.setFilter('odd-street-trees', value);
    } else if ('park-trees' === name) {
      map.setFilter('even-park-trees', value);
      map.setFilter('odd-park-trees', value);
    }
  });
};

export const initMapbox = (onLoad: () => void) => {
  map = new mapboxgl.Map({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string,
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-122.6, 45.5],
    zoom: 11,
  });

  map.on('load', () => {
    Object.values(layers).forEach(({ id, type, tileset }) => {
      map.addLayer(getLayer(id, type, tileset), 'road-label');
    });

    map.on('mousemove', (evt) => {
      const features = map.queryRenderedFeatures(evt.point, {
        layers: Object.values(layers).map(({ id }) => id),
      });

      if (features.length) {
        console.log(features);
      }
    });

    onLoad();
  });
};
