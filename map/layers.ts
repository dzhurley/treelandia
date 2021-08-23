import type MapboxGL from 'mapbox-gl';

export const layers: Record<
  string,
  { id: string; type: 'fill' | 'circle'; tileset: string }
> = {
  'odd-park-trees': {
    id: 'odd-park-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.6hbbsta4',
  },
  'even-park-trees': {
    id: 'even-park-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.do5m10lz',
  },
  'odd-street-trees': {
    id: 'odd-street-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.c6b9zb5u',
  },
  'even-street-trees': {
    id: 'even-street-trees',
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
        promoteId: 'geoid',
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
      promoteId: 'id',
    },
    'source-layer': 'data-layer',
    paint: {
      'circle-color': 'green',
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1, 20, 8],
    },
  };
};
