import { Box, Button, Spinner } from "@chakra-ui/react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import PlaylistSelect from "../../components/AccountView/Playlists/PlaylistSelect";
import PlaylistSelectCard from "../../components/AccountView/Playlists/PlaylistSelectCard";
import { useUser } from "../../components/AuthProvider";
import { userRef } from "../../firebase/firebase";
import {
  saveUserPlaylist,
  saveUserSavedTracks,
} from "../../firebase/playlists/savePlaylists";
import { AccountCollectionDoc } from "../../models/firebase/account";
import { TransformedPlaylistData } from "../../models/spotify/playlists";
import {
  getPlaylistSongsFromID,
  getUserPlaylists,
  getUserSavedTracks,
  getUserSavedTracksData,
} from "../../utils/spotify/playlistRequests";

const AccountInit: NextPage = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<AccountCollectionDoc>();
  const [loading, setLoading] = useState(true);

  const [uploadState, setUploadState] = useState<
    "Idle" | "Uploading" | "Uploaded"
  >("Idle");

  const [playlistsData, setPlaylistsData] = useState<
    TransformedPlaylistData[] | null
  >(null);
  const [savedTracksData, setSavedTracksData] =
    useState<TransformedPlaylistData | null>(null);

  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(
    new Set()
  );
  const [publicPlaylists, setPublicPlaylists] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();

  const loadPlaylistDataCallback = useCallback(async () => {
    if (
      loading &&
      userData &&
      userData.usersSpotifyTokenData &&
      userData.usersSpotifyTokenData.accessToken
    ) {
      const userPlaylists = await getUserPlaylists(
        userData.usersSpotifyTokenData.accessToken
      );
      if (!("status" in userPlaylists)) {
        setPlaylistsData(userPlaylists);
      }
      const savedTracks = await getUserSavedTracksData(
        userData.usersSpotifyTokenData.accessToken,
        userData.id
      );
      if (!("status" in savedTracks)) {
        setSavedTracksData(savedTracks);
      }
      setLoading(false);
    }
  }, [loading, userData]);

  useEffect(() => {
    loadPlaylistDataCallback();
  }, [loadPlaylistDataCallback]);

  useEffect(() => {
    if (userData && userData.playlistIDs.length > 0) {
      router.back()
    }

    if (!userData && user) {
      getDoc(doc(userRef, user.uid)).then((data) => {
        setUserData(data.data() as AccountCollectionDoc);
      });
    } 
  }, [user, userData]);

  const uploadPlaylists = async () => {
    if (playlistsData && user && userData && savedTracksData) {
      const mergedArr = [...playlistsData, savedTracksData];

      setUploadState("Uploading");
      let uploadedPlaylistsIds: string[] = [];

      for (let i = 0; i < mergedArr.length; i++) {
        if (
          selectedPlaylists.has(mergedArr[i].id) &&
          userData.usersSpotifyTokenData &&
          userData.usersSpotifyTokenData.accessToken
        ) {
          if (mergedArr[i].id.includes("_st")) {
            const savedTracks = await getUserSavedTracks(
              userData.usersSpotifyTokenData.accessToken
            );
            if (!("status" in savedTracks)) {
              await saveUserSavedTracks(
                user.uid,
                savedTracks,
                publicPlaylists.has(mergedArr[i].id)
              );
              uploadedPlaylistsIds.push(mergedArr[i].id);
            }
          } else {
            const playlistSongs = await getPlaylistSongsFromID(
              userData.usersSpotifyTokenData.accessToken,
              mergedArr[i].id
            );
            if (!("status" in playlistSongs)) {
              await saveUserPlaylist(
                playlistSongs,
                mergedArr[i],
                publicPlaylists.has(mergedArr[i].id)
              );
              uploadedPlaylistsIds.push(mergedArr[i].id);
            }
          }
        }
      }
      const newAccountData: AccountCollectionDoc = {
        email: userData.email,
        displayName: userData.displayName,
        spotifyConnected: userData.spotifyConnected,
        gameWins: userData.gameWins,
        gameLosses: userData.gameLosses,
        totalScore: userData.totalScore,
        id: userData.id,
        spotifyID: userData.spotifyID,
        playlistIDs: uploadedPlaylistsIds,
        usersSpotifyTokenData: userData.usersSpotifyTokenData,
        spotifyProfileData: userData.spotifyProfileData,
      };
      await setDoc(doc(userRef, userData.id), newAccountData);
      setUploadState("Uploaded");
    }
  };

  return (
    <Box bg={"black"} color="gray.300" minH="100vh" pb={20}>
      <Head>
        <title>Upload Your Playlists</title>
        <meta name="Account Page" content="Account Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <Spinner size="xl" color="green.300" thickness="4px" speed="0.55s" />
      )}
      {playlistsData && savedTracksData && uploadState == "Idle" && (
        <PlaylistSelect
          playlists={[...playlistsData, savedTracksData]}
          setPublicPlaylists={setPublicPlaylists}
          setSelectedPlaylists={setSelectedPlaylists}
          publicPlaylists={publicPlaylists}
          selectedPlaylists={selectedPlaylists}
        />
      )}

      {uploadState == "Idle" && (
        <Button
          pos="fixed"
          zIndex={100}
          left={6}
          bottom={6}
          size="lg"
          shadow={"2xl"}
          colorScheme={"purple"}
          mt={16}
          isLoading={loading}
          onClick={() =>
            uploadPlaylists().then(() => {
              router.back();
            })
          }
        >
          Upload
        </Button>
      )}

      {uploadState == "Uploading" && (
        <Spinner size="xl" color="green.300" thickness="4px" speed="0.55s" />
      )}
    </Box>
  );
};

export default AccountInit;
