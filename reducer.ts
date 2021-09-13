import type { MapboxGeoJSONFeature } from 'mapbox-gl';

export type State = {
  center: [number, number];
  filters: Record<string, any>;
  hovered: MapboxGeoJSONFeature | null;
  selected: {
    tree: MapboxGeoJSONFeature | null;
    block: MapboxGeoJSONFeature | null;
  };
  zoom: number;
};

const LOCAL_STORAGE_STATE_KEY = 'treelandia-state';

const initialState: State = {
  center: [-122.6, 45.5],
  filters: {
    'street-trees': true,
    'park-trees': true,
  },
  hovered: null,
  selected: {
    tree: null,
    block: null,
  },
  zoom: 11,
};

// pull from localstorage
const getState = (): State | undefined => {
  try {
    const storedState = window?.localStorage?.getItem?.(
      LOCAL_STORAGE_STATE_KEY,
    );
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    return;
  }
};

// set into localstorage
const setState = (state: State) => {
  try {
    window?.localStorage?.setItem?.(
      LOCAL_STORAGE_STATE_KEY,
      JSON.stringify(state),
    );
  } catch (error) {}
};

export const getInitialState = (): State => {
  let state = getState();
  if (!state) {
    setState(initialState);
    state = initialState;
  }
  return state;
};

export type ActionType =
  | 'updateFilter'
  | 'updateHover'
  | 'updateMap'
  | 'updateSelected';

export type Action = { type: ActionType; [key: string]: any };

export const reducer = (state: State, action: Action) => {
  let newState = state;

  switch (action.type) {
    case 'updateFilter':
      newState = {
        ...state,
        filters: {
          ...state.filters,
          [action.name]: action.value,
        },
      };
      break;
    case 'updateHover':
      newState = {
        ...state,
        hovered: action.hovered ?? null,
      };
      break;
    case 'updateMap':
      newState = {
        ...state,
        center: action.center,
        zoom: action.zoom,
      };
      break;
    case 'updateSelected':
      newState = {
        ...state,
        selected: action.selected,
      };
      break;
  }

  // update localstorage after each action
  setState(newState);
  return newState;
};
