import { Box, Heading, HStack } from "@chakra-ui/react";
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
        console.log(playlist);
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

      <Heading> Public Playlists </Heading>
      {playlists && (
        <HStack>
          {playlists.map((playlist: PlaylistCollectionDoc) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))}
        </HStack>
      )}

      <Heading> Your Playlists </Heading>

      {personalPlaylists && (
        <HStack>
          {personalPlaylists.map((playlist: PlaylistCollectionDoc) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))}
        </HStack>
      )}
    </Box>
  );
};

export default Home;
