import {
  Box,
  Center,
  Grid,
  Heading,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import PlaylistCard from "components/Playlists/PlaylistCard";
import { userRef } from "../firebase/firebase";
import { doc, getDoc, query, where } from "firebase/firestore";
import { AccountCollectionDoc } from "models/firebase/account";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../components/AuthProvider";
import {
  getFSPlaylistDataFromID,
  getPlaylistsWithWhereQuery,
} from "../firebase/playlists/getPlaylists";
// "../../firebase/playlists/getPlaylists";

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

      let docs = await getPlaylistsWithWhereQuery("public", "!=", "true");
      const playlistArr: PlaylistCollectionDoc[] = [];
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
        const playlistsArr: PlaylistCollectionDoc[] = [];
        for (let i = 0; i < playlistIDs.length; i++) {
          const playlist: PlaylistCollectionDoc | void =
            await getFSPlaylistDataFromID(playlistIDs[i]);
          if (playlist) {
            playlistArr.push(playlist);
          }
        }
        setPersonalPlaylists(playlistArr);
      }
    }
  }, [loading, user]);

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

      {loading && !playlists && !personalPlaylists && (
        <Spinner size="xl" color="orange" />
      )}

      {!loading && (
        <VStack w="100%">
          <Heading> Public Playlists </Heading>
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

          <Heading> Your Playlists </Heading>

          {personalPlaylists && (
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
              {personalPlaylists.map((playlist: PlaylistCollectionDoc) => (
                <PlaylistCard playlist={playlist} key={playlist.id} />
              ))}
            </Grid>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Home;
