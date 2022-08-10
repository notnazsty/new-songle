import {
  Box,
  Center,
  Spinner,
  VStack,
  Text,
  Button,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { userRef } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AccountCollectionDoc } from "models/firebase/account";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { signin } from "../firebase/signIn";
import { useUser } from "../components/AuthProvider";
import {
  getFSPlaylistDataFromID,
  getPlaylistsWithWhereQuery,
} from "../firebase/playlists/getPlaylists";
import PlaylistQuerySearchbar from "components/HomePage/PlaylistQuerySearchbar";
import Navbar from "components/Layout/Navbar";
import PlaylistCarousel from "components/HomePage/PlaylistCarousel";

const Home: NextPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<PlaylistCollectionDoc[] | null>(
    null
  );
  const [personalPlaylists, setPersonalPlaylists] = useState<
    PlaylistCollectionDoc[] | null
  >(null);

  const loadPlaylists = useCallback(async () => {
    if (loading && user) {
      setLoading(false);

      let docs = await getPlaylistsWithWhereQuery("public", "==", true);
      let playlistArr: PlaylistCollectionDoc[] = [];
      for (let i = 0; i < docs.size; i++) {
        const playlist: PlaylistCollectionDoc = (await docs.docs[
          i
        ].data()) as PlaylistCollectionDoc;
        playlistArr.push(playlist);
      }
      setPlaylists(playlistArr);

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
    <Box bg={"black"} color="gray.300" minH="100vh">
      <Navbar maxWidth="6xl" />
      <Head>
        <title>Songle</title>
        <meta name="description" content="Songle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack pos="relative">
        <Box
          h={64}
          w="100%"
          maxW="6xl"
          bgImg={"/spotifyBanner.gif"}
          bgSize={"cover"}
          bgPos="center"
        />
        {/*
              USE RALEWAY FOR FONT
              https://www.designyourway.net/blog/typography/spotify-font/#:~:text=Raleway,it%20for%20big%20display%20purposes.
          */}
        <Text pt={8}> This website is still under development.</Text>
      </VStack>

      {!user && (
        <Stack
          direction={{ base: "column", lg: "row" }}
          w="100%"
          maxW="6xl"
          bg="gray.900"
          justifyContent={"center"}
          mx="auto"
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            w="100%"
            bgColor="green.700"
            p={6}
            px={{ md: 16 }}
            flexShrink={1}
            flexGrow={0}
            align="center"
            spacing={6}
          >
            <Text
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              textAlign={{ base: "center", md: "left" }}
              color="pink.100"
              fontWeight={"medium"}
            >
              Test Your Playlist Knowledge
            </Text>
            <Box boxSize={"180px"} pos="relative">
              <Icon
                pos="absolute"
                left={0}
                bottom={0}
                boxSize={"160px"}
                color="pink.300"
                zIndex={12}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </Icon>
              <Icon
                pos="absolute"
                boxSize={"40px"}
                color="pink.400"
                top={4}
                left={8}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </Icon>
              <Icon
                pos="absolute"
                boxSize={"48px"}
                color="pink.200"
                left={3}
                bottom={16}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </Icon>
              <Icon
                pos="absolute"
                boxSize={"48px"}
                color="pink.100"
                right={0}
                top={3}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </Icon>
            </Box>
          </Stack>
          <VStack minW="min(100vw, 300px)" p={4} justify="center">
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

      {user && (
        <>
          {loading ||
            !playlists ||
            (!personalPlaylists && (
              <Center p={8}>
                <Spinner size="xl" color="orange" />
              </Center>
            ))}

          {!loading && playlists && personalPlaylists && (
            <VStack w="100%" py={{ base: 4, md: 8 }} alignItems="center">
              <Box maxW="6xl" w="100%" p={4}>
                {/* Add Search Bar Stuff Here */}
                <PlaylistQuerySearchbar />
              </Box>

              <PlaylistCarousel
                name="Popular Playlists"
                playlists={playlists}
              />

              <PlaylistCarousel
                name="Your Playlists"
                playlists={personalPlaylists}
              />
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;
