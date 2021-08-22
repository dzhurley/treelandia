import type { NextPage } from 'next';
import Head from 'next/head';

import Map from '../components/Map';
// import Panel from '../components/Panel';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Treeland</title>
      </Head>

      <Map />

      {/* <Panel /> */}
    </>
  );
};

export default Home;
