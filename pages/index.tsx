import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useUser } from "../components/AuthProvider";

const Home: NextPage = () => {
  
  const { user } = useUser();

  return (
    <Box bg={"black"} color="gray.300" minH="100vh">
      <Head>
        <title>Songle</title>
        <meta name="description" content="Songle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    



    </Box>

  );
};

export default Home;
