import { useEffect, useRef } from 'react';
import type MapboxGL from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import styles from './Map.module.css';

const getLayer = (
  id: string,
  type: 'fill' | 'circle',
  tileset: string,
): MapboxGL.FillLayer | MapboxGL.CircleLayer => {
  if (type === 'fill') {
    return {
      id,
      type,
      source: {
        type: 'vector',
        url: tileset,
      },
      'source-layer': 'data-layer',
      paint: {
        'fill-color': 'rgba(0, 255, 0, 0.1)',
        'fill-outline-color': 'white',
      },
    };
  }

  return {
    id,
    type,
    source: {
      type: 'vector',
      url: tileset,
    },
    'source-layer': 'data-layer',
    paint: {
      'circle-color': 'green',
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1, 20, 8],
    },
  };
};

const layers: Record<
  string,
  { id: string; type: 'fill' | 'circle'; tileset: string }
> = {
  oddParkTrees: {
    id: 'odd-park-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.6hbbsta4',
  },
  eventParkTrees: {
    id: 'event-park-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.do5m10lz',
  },
  oddStreetTrees: {
    id: 'odd-street-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.c6b9zb5u',
  },
  eventStreetTrees: {
    id: 'event-street-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.cceeczvt',
  },
  equity: {
    id: 'equity',
    type: 'fill',
    tileset: 'mapbox://dzhurley.1134azh6',
  },
};

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

    const map = mapboxRef.current;

    map.on('load', () => {
      Object.values(layers).forEach(({ id, type, tileset }) => {
        map.addLayer(getLayer(id, type, tileset), 'road-label');
      });

      map.on('mousemove', (evt) => {
        const features = map.queryRenderedFeatures(evt.point);
        console.log(features);
      });
    });
  }, []);

  return <section id="map" className={styles.map} />;
};

export default Map;
