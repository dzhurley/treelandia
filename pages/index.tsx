import { useCallback, useReducer, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Filters from '../components/Filters';
import Hover from '../components/Hover';
import Map from '../components/Map';

import { initialState, reducer } from '../reducer';

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mapContainerRef = useRef<HTMLElement>(null);

  const updateFilter = useCallback((name, value) => {
    dispatch({ type: 'updateFilter', name, value });
  }, []);

  const updateHover = useCallback((hovered) => {
    dispatch({ type: 'updateHover', hovered });
  }, []);

  return (
    <>
      <Head>
        <title>Treelandia</title>
      </Head>

      <Map
        mapContainerRef={mapContainerRef}
        filters={state.filters}
        updateHover={updateHover}
      />

      <Filters filters={state.filters} updateFilter={updateFilter} />

      <Hover mapContainerRef={mapContainerRef} hovered={state.hovered} />
    </>
  );
};

export default Home;
