import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "../components/AuthProvider";
import ErrorProvider from "components/ErrorProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <ErrorProvider>
          <Component {...pageProps} />
        </ErrorProvider>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
