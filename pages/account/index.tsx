import {
  Box,
  Button,
  Center,
  Spinner,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import Navbar from "components/Layout/Navbar";
import { getDoc, doc } from "firebase/firestore";
import { getFSPlaylistDataFromID } from "../../firebase/playlists/getPlaylists";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import ProfileCard from "../../components/AccountView/ProfileCard";
import { useUser } from "../../components/AuthProvider";
import { userRef } from "../../firebase/firebase";
import { AccountCollectionDoc } from "../../models/firebase/account";
import PlaylistCarousel from "components/HomePage/PlaylistCarousel";
import { signin } from "../../firebase/signIn";

const Account: NextPage = () => {
  const { user, userData, userLoading } = useUser();
  const [personalPlaylists, setPersonalPlaylists] = useState<
    PlaylistCollectionDoc[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  const loadPlaylists = useCallback(async () => {
    if (loading && user) {
      setLoading(false);

      const userData = await getDoc(doc(userRef, user.uid));
      if (userData.exists()) {
        const playlistIDs: string[] = await (
          userData.data() as AccountCollectionDoc
        ).playlistIDs;
        let playlistsArr: PlaylistCollectionDoc[] = [];
        for (let i = 0; i < playlistIDs.length; i++) {
          const playlist: PlaylistCollectionDoc | void =
            await getFSPlaylistDataFromID(playlistIDs[i]);
          if (playlist) {
            playlistsArr.push(playlist);
          }
        }
        setPersonalPlaylists(playlistsArr);
      }
    }
  }, [loading, user]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  return (
    <Box bg={"black"} color="gray.300" minH="100vh" w="100%">
      <Head>
        <title>Account Page</title>
        <meta name="Account Page" content="Account Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar maxWidth="6xl" />

      <VStack w="100%" py={{ base: 4, md: 8 }} alignItems="center">
        {userData && <ProfileCard account={userData} />}

        {!user && !userLoading && (
          <Stack
            w="100%"
            justifyContent={"center"}
            alignItems="center"
            h="100%"
          >
            <VStack maxW="md" w="100%" p={4}>
              <Text fontSize="2xl"> Login to your account.</Text>
              <Button
                colorScheme={"purple"}
                w="100%"
                justifyContent={"center"}
                size="lg"
                onClick={() => signin()}
              >
                Sign Up
              </Button>
              <Button
                colorScheme={"green"}
                w="100%"
                size="lg"
                justifyContent={"center"}
                onClick={() => signin()}
              >
                Log In
              </Button>
            </VStack>
          </Stack>
        )}

        {loading ||
          (!personalPlaylists && (
            <Center p={8}>
              <Spinner size="xl" color="orange" />
            </Center>
          ))}

        {!loading && personalPlaylists && (
          <PlaylistCarousel
            name="Your Playlists"
            playlists={personalPlaylists}
          />
        )}
      </VStack>
    </Box>
  );
};

export default Account;
