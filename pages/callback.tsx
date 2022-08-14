import { Box, Center, Spinner } from "@chakra-ui/react";
import { useError } from "components/ErrorProvider";
import { getDoc, doc, setDoc } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../components/AuthProvider";
import { userRef } from "../firebase/firebase";
import {
  UsersSpotifyTokenData,
  UserSpotifyProfileData,
} from "../models/firebase/account";
import { SpotifyTokenResponse } from "../models/spotify/user";
import { getSpotifyData } from "../utils/spotify/accountRequests";

const Callback: NextPage = () => {
  const [userCode, setUserCode] = useState<string | null>(null);
  const { user, userLoading: loading } = useUser();

  const router = useRouter();
  const { onOpen, setErrorStatus, setMessage } = useError();

  const code =
    typeof router.query["code"] === "string" ? router.query["code"] : null;

  useEffect(() => {
    setUserCode(code);
  }, [code]);

  useEffect(() => {
    if (user && userCode) {
      fetch("/api/initialSpotifyAuth?code=" + encodeURI(userCode))
        .then(async (data) => {
          const tokenData = await data.json();
          if ("refresh_token" in tokenData) {
            const tknData = tokenData as SpotifyTokenResponse;

            const spotifyTokenData: UsersSpotifyTokenData = {
              accessToken: tknData.access_token,
              tokenType: tknData.token_type,
              lastRequested: new Date(),
              refreshToken: tknData.refresh_token,
              scope: tknData.scope,
            };

            await setDoc(
              doc(userRef, user.uid),
              { usersSpotifyTokenData: spotifyTokenData },
              { merge: true }
            );

            const profileData = await getSpotifyData(tknData.access_token);

            if (!("status" in profileData)) {
              const docRef = await getDoc(doc(userRef, user.uid));
              const uploadProfileData: UserSpotifyProfileData = {
                country: profileData.country,
                display_name: profileData.display_name,
                email: profileData.email,
                href: profileData.href,
                id: profileData.id,
                images: profileData.images,
              };

              await setDoc(
                doc(userRef, user.uid),
                {
                  spotifyConnected: true,
                  spotifyProfileData: uploadProfileData,
                },
                { merge: true }
              );
            } else {
              setErrorStatus(profileData.status);
              setMessage(profileData.message);
              onOpen();
            }

            router.push("/account");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!loading) {
      router.push("/account");
    }
  }, [loading, onOpen, router, setErrorStatus, setMessage, user, userCode]);

  return (
    <Box bg={"black"} color="gray.300" minH="100vh">
      <Head>
        <title>loading</title>
        <meta name="loading" content="loading user data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center w="100%">
        <Spinner size="xl" color="green" />
      </Center>
    </Box>
  );
};

export default Callback;
