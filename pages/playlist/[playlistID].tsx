import { Box, Spinner } from "@chakra-ui/react";
import CasualGame from "components/Game/Casual/CasualGame";
import Navbar from "components/Layout/Navbar";
import { getDoc, doc } from "firebase/firestore";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import PlaylistOverview from "../../components/Game/PlaylistOverview";
import StandardGame from "../../components/Game/Standard/StandardGame";
import { getFSPlaylistDataFromID } from "../../firebase/playlists/getPlaylists";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import { Song } from "../../models/spotify/songs";
import { shuffle } from "../../utils/game/methods";

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
        const data = await getFSPlaylistDataFromID(playlistID);

        if (data) {
          setPlaylistData(data);
          setSongList(shuffle(data.savedTracks));
        }

        setLoading(false);

        // Load and update playlist leaderboard data etc player high score too
      }
    }
  }, [loading, router.query.playlistID]);

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
            setGameMode={setGameMode}
          />
        ) : (
          <></>
        );
      case "Casual":
        return playlistData ? (
          <CasualGame
            songList={playlistData.savedTracks}
            setGameMode={setGameMode}
          />
        ) : (
          <></>
        );
      default:
        const exhaustive: never = gameMode;
    }
  };

  return (
    <Box bg={"black"} color="gray.300" minH="100vh">
      <Navbar maxWidth="100%" />
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
