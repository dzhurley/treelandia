import type { FillLayer, CircleLayer } from 'mapbox-gl';

// all custom layers
export const layers: Record<
  string,
  { id: string; type: 'fill' | 'circle'; tileset?: string }
> = {
  equity: {
    id: 'equity',
    type: 'fill',
    tileset: 'mapbox://dzhurley.9ou30cpk',
  },
  'park-trees': {
    id: 'park-trees',
    type: 'circle',
    tileset: 'mapbox://dzhurley.d0i4jfdd',
  },
  'street-trees-0': {
    id: 'street-trees-0',
    type: 'circle',
    tileset: 'mapbox://dzhurley.a5969t8n',
  },
  'street-trees-1': {
    id: 'street-trees-1',
    type: 'circle',
    tileset: 'mapbox://dzhurley.d68ken52',
  },
  'street-trees-2': {
    id: 'street-trees-2',
    type: 'circle',
    tileset: 'mapbox://dzhurley.8w2pien7',
  },
  'street-trees-3': {
    id: 'street-trees-3',
    type: 'circle',
    tileset: 'mapbox://dzhurley.3nftwtqk',
  },
  'street-trees-4': {
    id: 'street-trees-4',
    type: 'circle',
    tileset: 'mapbox://dzhurley.20qajc2t',
  },
  hovered: {
    id: 'hovered',
    type: 'circle',
  },
  selected: {
    id: 'selected',
    type: 'circle',
  },
};

// all layers searchable with queryRenderedFeatures
export const interactiveLayers = [
  'park-trees',
  'street-trees-0',
  'street-trees-1',
  'street-trees-2',
  'street-trees-3',
  'street-trees-4',
  'equity',
];

// select correct style spec based on layer id
export const getLayer = (
  id: string,
  type: 'fill' | 'circle',
  tileset?: string,
): FillLayer | CircleLayer => {
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
        'fill-color': 'rgba(0, 0, 0, 0)',
        'fill-outline-color': 'rgba(255, 255, 255, 0.75)',
      },
    };
  }

  if (id === 'hovered' || id === 'selected') {
    return {
      id,
      type,
      source: id,
      paint: {
        'circle-color': 'green',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1, 20, 8],
        'circle-stroke-color': 'white',
        'circle-stroke-width': id === 'selected' ? 8 : 4,
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
