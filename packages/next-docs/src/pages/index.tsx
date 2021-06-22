import * as React from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

export default function Home() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace('/components');
  });
  return (
    <>
      <Head>
        <title>MJZ UI</title>
        <meta name="description" content="TEST" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
    </>
  );
}
