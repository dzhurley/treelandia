import type { NextPage } from 'next';
import Head from 'next/head';

import Filters from '../components/Filters';
import Map from '../components/Map';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Treelandia</title>
      </Head>

      <Map />

      <Filters />
    </>
  );
};

export default Home;
