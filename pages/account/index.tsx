import { Box, Button, Center, Spinner, VStack } from "@chakra-ui/react";
import Navbar from "components/Layout/Navbar";
import { getDoc, doc } from "firebase/firestore";
import { getFSPlaylistDataFromID } from "../../firebase/playlists/getPlaylists";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import ProfileCard from "../../components/AccountView/ProfileCard";
import { useUser } from "../../components/AuthProvider";
import { userRef } from "../../firebase/firebase";
import { AccountCollectionDoc } from "../../models/firebase/account";
import PlaylistCarousel from "components/HomePage/PlaylistCarousel";

const Account: NextPage = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<AccountCollectionDoc | null>(null);
  const [personalPlaylists, setPersonalPlaylists] = useState<
    PlaylistCollectionDoc[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const loadPlaylists = useCallback(async () => {
    if (loading && user) {
      setLoading(false);

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

  useEffect(() => {
    if (!userData && user) {
      getDoc(doc(userRef, user.uid)).then((data) => {
        setUserData(data.data() as AccountCollectionDoc);
      });
    }
  }, [user, userData]);

  return (
    <Box bg={"black"} color="gray.300" minH="100vh" w="100%">
      <Head>
        <title>Account Page</title>
        <meta name="Account Page" content="Account Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar maxWidth="6xl" />

      <VStack w="100%" py={{ base: 4, md: 8 }} alignItems="center">
        {userData && <ProfileCard account={userData} />}

        {/* Users Saved Tracks And Other Info */}

        {loading ||
          (!personalPlaylists && (
            <Center p={8}>
              <Spinner size="xl" color="orange" />
            </Center>
          ))}

        {!loading && personalPlaylists && (
          <PlaylistCarousel
            name="Your Playlists"
            playlists={personalPlaylists}
          />
        )}
      </VStack>
    </Box>
  );
};

export default Account;
