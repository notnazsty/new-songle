import {
  Box,
  Heading,
  Spinner,
  VStack,
  Text,
  Image,
  HStack,
  Button,
  Grid,
  Stack,
} from "@chakra-ui/react";
import { getDoc, doc } from "firebase/firestore";
import { NextPage } from "next";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import SongGrid from "../../components/Game/SongGrid";
import { getFSPlaylistDataFromID } from "../../firebase/playlists/getPlaylists";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";

const PlaylistPage: NextPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [playlistData, setPlaylistData] =
    useState<PlaylistCollectionDoc | null>(null);
  const [gameState, setGameState] = useState<"Idle" | "Loading" | "Ready">(
    "Idle"
  );

  const loadPlaylist = useCallback(async () => {
    if (loading) {
      const playlistID = router.query.playlistID as string;

      if (playlistID) {
        console.log(playlistData);

        const data = await getFSPlaylistDataFromID(playlistID);

        if (data) {
          setPlaylistData(data);
          console.log(playlistData);
        }

        setLoading(false);

        // Load and update playlist leaderboard data etc player high score too
      }
    }
  }, [loading, playlistData, router.query.playlistID]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const loadLyricQueue = useCallback(() => {
    let lyricQueue: string[] = [];
  }, []);

  useEffect(() => {}, []);

  return (
    <Box bg={"black"} color="gray.300" minH="100vh">
      <Head>
        {playlistData ? (
          <title> {playlistData.name} </title>
        ) : (
          <title> ... </title>
        )}
        <meta name="description" content="Songle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && <Spinner />}

      {playlistData && !loading && (
        <VStack w="100%" justifyContent={"center"}>
          <Heading> {playlistData.name} </Heading>

          {gameState == "Idle" && (
            <VStack align="start" spacing={6}>
              {/* Paginate This */}
              <SongGrid savedTracks={playlistData.savedTracks} />
              <Button
                colorScheme={"green"}
                onClick={() => setGameState("Ready")}
              >
                Start Game
              </Button>
            </VStack>
          )}

          {gameState == "Loading" && <Spinner />}

          {gameState == "Ready" && <Text> lyrics </Text>}
        </VStack>
      )}
    </Box>
  );
};

export default PlaylistPage;
