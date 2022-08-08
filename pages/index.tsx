import {
  Box,
  Center,
  Grid,
  Heading,
  Spinner,
  Image as ChakraImage,
  VStack,
  Text,
  Button,
  HStack,
  Stack,
  Icon,
} from "@chakra-ui/react";
import gif from "../public/spotifyBanner.gif";
import PlaylistCard from "components/HomePage/PlaylistCard";
import { userRef } from "../firebase/firebase";
import { doc, getDoc, query, where } from "firebase/firestore";
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
import Image from "next/image";
import PlaylistQuerySearchbar from "components/HomePage/PlaylistQuerySearchbar";
import Navbar from "components/Layout/Navbar";

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
        console.log(playlistIDs);
        for (let i = 0; i < playlistIDs.length; i++) {
          const playlist: PlaylistCollectionDoc | void =
            await getFSPlaylistDataFromID(playlistIDs[i]);
          console.log(playlist);
          if (playlist) {
            playlistsArr.push(playlist);
          } else {
            console.log("failed");
          }
        }
        setPersonalPlaylists(playlistsArr);
      }
    }
  }, [loading, user]);

  useEffect(() => {
    console.log(personalPlaylists);
  }, [personalPlaylists]);

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
        {/* <Image src={gif} alt="spotify" /> */}
          {/*
              USE RALEWAY FOR FONT
              https://www.designyourway.net/blog/typography/spotify-font/#:~:text=Raleway,it%20for%20big%20display%20purposes.
          */}

        <Text> This website is still under development.</Text>
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
            px={{md: 16}}
            flexShrink={1}
            flexGrow={0}
            align="center"
            spacing={6}
          >
            <Text
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              textAlign={{base: "center", md: "left"}}
              color="pink.100"
              fontWeight={"medium"}
            >
              Test Your Playlist Knowledge
            </Text>
            <Box boxSize={"180px"} pos="relative">
              <Icon pos="absolute" left={0} bottom={0} boxSize={"160px"} color="pink.300" zIndex={12}>
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
              <Icon pos="absolute" boxSize={"40px"} color="pink.400" top={4} left={8}>
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
              <Icon pos="absolute" boxSize={"48px"} color="pink.200" left={3} bottom={16}>
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
              <Icon pos="absolute" boxSize={"48px"} color="pink.100" right={0} top={3}>
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
          {/* <ChakraImage src="/banner.gif" alt="banner" /> */}
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
          {loading && !playlists && !personalPlaylists && (
            <Spinner size="xl" color="orange" />
          )}

          {!loading && (
            <VStack w="100%" py={{ base: 8, md: 16 }} alignItems="center">
              <Box maxW="6xl" w="100%" p={4}>
                {/* Add Search Bar Stuff Here */}
                <PlaylistQuerySearchbar />
              </Box>

              <VStack maxW="6xl" w="100%" p={4}  justifyContent={"left"} alignItems="left">
                <Text fontSize="2xl">
                  Popular Playlists
                </Text>
              </VStack>
              {playlists && (
                <Center maxW="6xl" w="100%" p={4}>
                  <Grid
                    w="100%"
                    templateColumns={{
                      sm: "repeat(3, 1fr)",
                      md: "repeat(4, 1fr)",
                      lg: "repeat(5, 1fr)",
                      xl: "repeat(5, 1fr)",
                    }}
                    gap={6}
                  >
                    {playlists.map((playlist: PlaylistCollectionDoc) => (
                      <PlaylistCard playlist={playlist} key={playlist.id} />
                    ))}
                  </Grid>
                </Center>
              )}

              {personalPlaylists && (
                <>
                  <VStack maxW="6xl" w="100%" p={4} justifyContent={"left"} alignItems="left">
                    <Text fontSize="2xl">
                      Your Playlists
                    </Text>
                  </VStack>
                  <Grid
                    maxW="6xl" w="100%" p={4}
                    templateColumns={{
                      sm: "repeat(3, 1fr)",
                      md: "repeat(4, 1fr)",
                      lg: "repeat(5, 1fr)",
                      xl: "repeat(5, 1fr)",
                    }}
                  >
                    {personalPlaylists.map(
                      (playlist: PlaylistCollectionDoc) => (
                        <PlaylistCard playlist={playlist} key={playlist.id} />
                      )
                    )}
                  </Grid>
                </>
              )}
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;
