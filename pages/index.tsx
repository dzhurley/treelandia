import { useCallback, useReducer, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Filters from '../components/Filters';
import Hover from '../components/Hover';
import Map from '../components/Map';
import Selected from '../components/Selected';

import { getInitialState, reducer } from '../reducer';

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const mapContainerRef = useRef<HTMLElement>(null);

  const updateFilter = useCallback((name, value) => {
    dispatch({ type: 'updateFilter', name, value });
  }, []);

  const updateHover = useCallback((hovered) => {
    dispatch({ type: 'updateHover', hovered });
  }, []);

  const updateMap = useCallback((center, zoom) => {
    dispatch({ type: 'updateMap', center, zoom });
  }, []);

  const updateSelected = useCallback((selected) => {
    dispatch({ type: 'updateSelected', selected });
  }, []);

  return (
    <>
      <Head>
        <title>Treelandia</title>
      </Head>

      <Map
        mapContainerRef={mapContainerRef}
        filters={state.filters}
        center={state.center}
        zoom={state.zoom}
        updateHover={updateHover}
        updateMap={updateMap}
        updateSelected={updateSelected}
      />

      <Filters filters={state.filters} updateFilter={updateFilter} />

      <Selected tree={state.selected.tree} block={state.selected.block} />

      <Hover mapContainerRef={mapContainerRef} hovered={state.hovered} />
    </>
  );
};

export default Home;
