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
      <Head>
        <title>Songle</title>
        <meta name="description" content="Songle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack pos="relative">
        <Image src={gif} alt="spotify" />
        <VStack pos="absolute" justifyContent="space-between" h="100%">
          {/*
              USE RALEWAY FOR FONT
              https://www.designyourway.net/blog/typography/spotify-font/#:~:text=Raleway,it%20for%20big%20display%20purposes.
          */}
          <Text
            fontSize={{ base: "2xl", md: "6xl" }}
            color="white"
            fontWeight={"bold"}
          >
            {/* Test Your Playlist Knowledge */}
          </Text>
        </VStack>
      </VStack>

      {!user && (
        <Stack
          direction={{ base: "column", md: "row" }}
          w="100%"
          justifyContent={"center"}
          alignItems="center"
        >
          <ChakraImage src="/banner.gif" alt="banner" />
          <HStack>
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
          </HStack>
        </Stack>
      )}

      {user && (
        <>
          {loading && !playlists && !personalPlaylists && (
            <Spinner size="xl" color="orange" />
          )}

          {!loading && (
            <VStack w="100%" py={{ base: 8, md: 16 }} alignItems='left'>
              <Box maxW="5xl" w="100%" p={4} >
                {/* Add Search Bar Stuff Here */}
                <PlaylistQuerySearchbar />
              </Box>

              <VStack w="100%" justifyContent={"left"} alignItems="left">
                <Text fontSize="2xl" px={4}>
                  Popular Playlists
                </Text>
              </VStack>
              {playlists && (
                <Center w="100% ">
                  <Grid
                    px={4}
                    w="100%"
                    templateColumns={{
                      sm: "repeat(3, 1fr)",
                      md: "repeat(4, 1fr)",
                      lg: "repeat(5, 1fr)",
                      xl: "repeat(5, 1fr)",
                    }}
                  >
                    {playlists.map((playlist: PlaylistCollectionDoc) => (
                      <PlaylistCard playlist={playlist} key={playlist.id} />
                    ))}
                  </Grid>
                </Center>
              )}

              {personalPlaylists && (
                <>
                  <VStack w="100%" justifyContent={"left"} alignItems="left">
                    <Text fontSize="2xl" px={4}>
                      Your Playlists
                    </Text>
                  </VStack>
                  <Grid
                    mx={4}
                    w="100%"
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
