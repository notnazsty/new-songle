import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "../components/AuthProvider";
import Navbar from "../components/Layout/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
