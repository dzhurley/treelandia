import type { MapboxGeoJSONFeature } from 'mapbox-gl';

export type State = {
  filters: Record<string, any>;
  hovered: MapboxGeoJSONFeature | null;
};

export const initialState: State = {
  filters: {
    'street-trees': true,
    'park-trees': true,
  },
  hovered: null,
};

export type ActionType = 'updateFilter' | 'updateHover';

export type Action = { type: ActionType; [key: string]: any };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'updateFilter':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.name]: action.value,
        },
      };
    case 'updateHover':
      return {
        ...state,
        hovered: action.hovered ?? null,
      };
    default:
      return state;
  }
};
