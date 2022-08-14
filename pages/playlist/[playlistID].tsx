import { Box, Spinner } from "@chakra-ui/react";
import CasualGame from "components/Game/Casual/CasualGame";
import Navbar from "components/Layout/Navbar";
import { updatePlaylistPopularity } from "../../firebase/playlists/savePlaylists";
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
import { useUser } from "components/AuthProvider";
import {
  addNewScoreToLeaderboard,
  loadLeaderboard,
} from "../../firebase/playlists/leaderboard";
import {
  LeaderboardCollection,
  LeaderboardScores,
} from "models/firebase/leaderboard";
import { leaderboardsRef } from "firebase/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { AccountCollectionDoc } from "models/firebase/account";

const PlaylistPage: NextPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [playlistData, setPlaylistData] =
    useState<PlaylistCollectionDoc | null>(null);

  const [songList, setSongList] = useState<Song[] | null>(null);

  const [gameMode, setGameMode] = useState<"Base" | "Standard" | "Casual">(
    "Base"
  );

  const [leaderboard, setLeaderboard] = useState<LeaderboardCollection | null>(
    null
  );

  const { userData } = useUser();

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
      }
    }
  }, [loading, router.query.playlistID]);

  useEffect(() => {
    if (playlistData ) {
      updatePlaylistPopularity(playlistData.id);

      const unsub = loadLeaderboard(
        playlistData.id,
        playlistData.name,
        setLeaderboard
      );

      return unsub;
    }
  }, [playlistData]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const updateLeaderboard = async (score: number, numCorrect: number) => {
    if (playlistData && userData && leaderboard) {
      const newScoreData: LeaderboardScores = {
        id: userData.id,
        name: userData.displayName,
        score: score,
        numCorrect: numCorrect,
        image: userData.spotifyProfileData?.images[0]
          ? userData.spotifyProfileData.images[0]
          : null,
      };
      await addNewScoreToLeaderboard(
        leaderboard,
        newScoreData,
        playlistData.id,
        playlistData.name
      );
    }
  };

  const handleGameModes = () => {
    switch (gameMode) {
      case "Base":
        return playlistData && userData && leaderboard ? (
          <PlaylistOverview
            playlistData={playlistData}
            setGameMode={setGameMode}
            userData={userData}
            leaderboard={leaderboard}
          />
        ) : (
          <> </>
        );
      case "Standard":
        return playlistData ? (
          <StandardGame
            songList={playlistData.savedTracks}
            setGameMode={setGameMode}
            updateLeaderboard={updateLeaderboard}
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

      {loading && !userData && !leaderboard && <Spinner />}

      {handleGameModes()}
    </Box>
  );
};

export default PlaylistPage;
