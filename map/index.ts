import type {
  Expression,
  GeoJSONSource,
  Map,
  MapEventType,
  MapMouseEvent,
} from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { State } from '../reducer';

import { interactiveLayers, layers, getLayer } from './layers';

export * from './layers';

let map: Map;

export interface MapboxAPI {
  updateLayers: (filters: Record<string, any>) => void;
  setSelectedFiltered: (visible: boolean) => void;
  onEvent: (name: keyof MapEventType, ...deps: any) => void;
}

const handlers: {
  [key in keyof MapEventType]?: (
    ...deps: any[]
  ) => (evt: MapMouseEvent) => void;
} = {
  mousemove: (updateHover: (hovered: State['hovered']) => void) => {
    let hoveredFeature: State['hovered'] = null;

    return (evt) => {
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
    };
  },

  click: (
    selected: State['selected']['tree'],
    updateSelected: (selected: State['selected']) => void,
  ) => {
    let selectedFeature: State['selected']['tree'] = selected;

    return (evt) => {
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
    };
  },

  idle:
    (updateMap: (center: State['center'], zoom: State['zoom']) => void) =>
    (evt) => {
      const { lng, lat } = evt.target.getCenter();
      updateMap([lng, lat], evt.target.getZoom());
    },
};

const listeners: {
  [key in keyof MapEventType]?: (evt: MapMouseEvent) => void;
} = {};

const api: MapboxAPI = {
  updateLayers: (filters) => {
    const streetCriteria: Expression[] = [];
    const parkCriteria: Expression[] = [];

    Object.entries(filters).forEach(([name, value]) => {
      if ('street-trees' === name) {
        streetCriteria.push(value);
      } else if ('park-trees' === name) {
        parkCriteria.push(value);
      } else {
        const sliderFilter: Expression[] = [
          ['has', name],
          ['>=', ['get', name], value[0]],
          ['<=', ['get', name], value[1]],
        ];

        streetCriteria.push(...sliderFilter);
        parkCriteria.push(...sliderFilter);
      }
    });

    Object.values(layers).forEach(({ id, type, tileset }) => {
      if (!map.getLayer(id)) {
        if (tileset) {
          map.addLayer(getLayer(id, type, tileset), 'road-label');
        } else {
          map.addLayer(getLayer(id, type));
        }
      }
    });

    map.setFilter('park-trees', ['all', ...parkCriteria]);

    const streetFilter = ['all', ...streetCriteria];
    map.setFilter('street-trees-0', streetFilter);
    map.setFilter('street-trees-1', streetFilter);
    map.setFilter('street-trees-2', streetFilter);
    map.setFilter('street-trees-3', streetFilter);
    map.setFilter('street-trees-4', streetFilter);
  },

  setSelectedFiltered: (visible) => {
    if (visible) {
      map.setPaintProperty('selected', 'circle-stroke-color', 'white');
      map.setPaintProperty('selected', 'circle-color', 'green');
    } else {
      map.setPaintProperty('selected', 'circle-stroke-color', 'gray');
      map.setPaintProperty('selected', 'circle-color', 'rgba(0, 0, 0, 0)');
    }
  },

  onEvent: (event, ...deps) => {
    const existing = listeners[event];
    if (existing) {
      map.off(event, existing);
      delete listeners[event];
    }

    const listener = handlers[event]?.(...deps);
    if (listener) {
      listeners[event] = listener;
      map.on(event, listener);
    }
  },
};

export const getMapbox = async (): Promise<MapboxAPI> => {
  return new Promise((resolve) => {
    // don't wait if the map is already loaded
    if (map?.loaded()) {
      return resolve(api);
    }
    // otherwise continually check until map is loaded
    const id = setInterval(() => {
      if (map?.loaded()) {
        clearInterval(id);
        return resolve(api);
      }
    }, 50);
  });
};

export const initMapbox = (
  center: [number, number],
  zoom: number,
  selected: State['selected']['tree'],
) => {
  map = new mapboxgl.Map({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string,
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center,
    zoom,
  });

  map.on('load', () => {
    map.addSource('hovered', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addSource('selected', {
      type: 'geojson',
      data: selected || { type: 'FeatureCollection', features: [] },
    });
  });
};
