import type MapboxGL from 'mapbox-gl';

export const layers: Record<
  string,
  {id: string; type: 'fill' | 'circle'; tileset: string}
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

export const getLayer = (
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
