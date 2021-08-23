import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Filters from '../components/Filters';
import Map from '../components/Map';

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(
    (
      state: { filters: Record<string, any> },
      action: { type: 'updateFilter'; [key: string]: any },
    ) => {
      switch (action.type) {
        case 'updateFilter':
          return {
            ...state,
            filters: {
              ...state.filters,
              [action.name]: action.value,
            },
          };
        default:
          return state;
      }
    },
    {
      filters: {
        'street-trees': true,
        'park-trees': true,
      },
    },
  );

  const updateFilter = useCallback((name, value) => {
    dispatch({ type: 'updateFilter', name, value });
  }, []);

  return (
    <>
      <Head>
        <title>Treelandia</title>
      </Head>

      <Map filters={state.filters} />

      <Filters filters={state.filters} updateFilter={updateFilter} />
    </>
  );
};

export default Home;
