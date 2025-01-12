import {
  Box,
  Image,
  Center,
  Spinner,
  VStack,
  Text,
  Button,
  Stack,
  Icon,
} from "@chakra-ui/react";
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
  const { user, userLoading, userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<PlaylistCollectionDoc[] | null>(
    null
  );
  const [personalPlaylists, setPersonalPlaylists] = useState<
    PlaylistCollectionDoc[] | null
  >(null);

  const loadPublicPlaylists = useCallback(async () => {
    if (loading) {
      console.log("hey");
      let docs = await getPlaylistsWithWhereQuery("public", "==", true);
      let playlistArr: PlaylistCollectionDoc[] = [];
      for (let i = 0; i < docs.size; i++) {
        const playlist: PlaylistCollectionDoc = (await docs.docs[
          i
        ].data()) as PlaylistCollectionDoc;
        playlistArr.push(playlist);
      }
      console.log(playlistArr);
      setPlaylists(playlistArr);
    }
  }, [loading]);

  const loadPlaylists = useCallback(async () => {
    if (loading && user && userData) {
      setLoading(false);
      const playlistIDs: string[] = await userData.playlistIDs;
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
  }, [loading, user, userData]);

  useEffect(() => {
    loadPublicPlaylists();
    loadPlaylists();
  }, [loadPlaylists, loadPublicPlaylists]);

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

      {loading ||
        !playlists ||
        (!personalPlaylists && (
          <Center p={8}>
            <Spinner size="xl" color="orange" />
          </Center>
        ))}
      <VStack w="100%" py={{ base: 4, md: 8 }} alignItems="center">
        <Box maxW="6xl" w="100%" p={4}>
          {/* Add Search Bar Stuff Here */}
          <PlaylistQuerySearchbar />
        </Box>
        {playlists && (
          <PlaylistCarousel name="Popular Playlists" playlists={playlists} />
        )}

        {user && !loading && personalPlaylists && (
          <PlaylistCarousel
            name="Your Playlists"
            playlists={personalPlaylists}
          />
        )}
      </VStack>

      {!user && !userLoading && (
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
              w="100%"
              maxW="xs"
              leftIcon={
                <Image src={"/google_logo.png"} alt={"Google"} boxSize={5} />
              }
              border="1px solid"
              borderColor={"gray.200"}
              backgroundColor="white"
              rounded="md"
              textColor={'black'}
              _hover={{ backgroundColor: "#efefef" }}
              onClick={async () => await signin()}
            >
              Sign in with Google
            </Button>
          </VStack>
        </Stack>
      )}
    </Box>
  );
};

export default Home;
