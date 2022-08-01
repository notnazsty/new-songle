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
import PlaylistOverview from "../../components/Game/PlaylistOverview";
import SongGrid from "../../components/Game/SongGrid";
import SongOptions from "../../components/Game/Standard/SongOptions";
import StandardGame from "../../components/Game/Standard/StandardGame";
import { getFSPlaylistDataFromID } from "../../firebase/playlists/getPlaylists";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import { Song } from "../../models/spotify/songs";
import { shuffle } from "../../utils/game/standard/methods";

const PlaylistPage: NextPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [playlistData, setPlaylistData] =
    useState<PlaylistCollectionDoc | null>(null);

  const [songList, setSongList] = useState<Song[] | null>(null);

  const [gameMode, setGameMode] = useState<"Base" | "Standard" | "Casual">(
    "Base"
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
          setSongList(shuffle(data.savedTracks));
        }

        setLoading(false);

        // Load and update playlist leaderboard data etc player high score too
      }
    }
  }, [loading, playlistData, router.query.playlistID]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const handleGameModes = () => {
    switch (gameMode) {
      case "Base":
        return playlistData ? (
          <PlaylistOverview
            playlistData={playlistData}
            setGameMode={setGameMode}
          />
        ) : (
          <> </>
        );
      case "Standard":
        return playlistData ? (
          <StandardGame
            songList={playlistData.savedTracks}
            setSongList={setSongList}
            setGameMode={setGameMode}
          />
        ) : (
          <></>
        );
      case "Casual":
        return <> </>;
      default:
        const exhaustive: never = gameMode;
    }
  };

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

      {handleGameModes()}
    </Box>
  );
};

export default PlaylistPage;
