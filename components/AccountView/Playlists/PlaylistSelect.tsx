import { Grid, Heading, Text } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TransformedPlaylistData } from "../../../models/spotify/playlists";
import PlaylistSelectCard from "./PlaylistSelectCard";

interface PlaylistSelectProps {
  playlists: TransformedPlaylistData[];
  setPublicPlaylists: Dispatch<SetStateAction<Set<string>>>;
  setSelectedPlaylists: Dispatch<SetStateAction<Set<string>>>;
  publicPlaylists: Set<string>;
  selectedPlaylists: Set<string>;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> = ({
  playlists,
  selectedPlaylists,
  publicPlaylists,
  setPublicPlaylists,
  setSelectedPlaylists,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      playlists.map((playlist) => {
        if (playlist.public) {
          publicPlaylists.add(playlist.id);
          setPublicPlaylists(new Set(publicPlaylists));
        }
      });
      setLoading(false);
    }
  }, [loading, playlists, publicPlaylists, setPublicPlaylists]);

  const togglePublicState = (id: string) => {
    if (publicPlaylists.has(id)) {
      publicPlaylists.delete(id);
      setPublicPlaylists(new Set(publicPlaylists));
    } else {
      publicPlaylists.add(id);
      setPublicPlaylists(new Set(publicPlaylists));
    }
  };

  const toggleSelectedState = (id: string) => {
    if (selectedPlaylists.has(id)) {
      selectedPlaylists.delete(id);
      setSelectedPlaylists(new Set(selectedPlaylists));
    } else {
      selectedPlaylists.add(id);
      setSelectedPlaylists(new Set(selectedPlaylists));
    }
  };

  return (
    <>
    <Heading w="100%" textAlign={"center"} pb={8} size={{base: "md", md: "xl"}}>Choose playlists to upload</Heading>
    <Grid templateColumns={{sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)", xl: "repeat(5, 1fr)"}} rowGap={12}>
      {playlists.map((playlist) => (
        <PlaylistSelectCard
          key={playlist.id}
          playlist={playlist}
          isSelected={selectedPlaylists.has(playlist.id)}
          isPublic={publicPlaylists.has(playlist.id)}
          togglePublicState={togglePublicState}
          toggleSelectedState={toggleSelectedState}
        />
      ))}
    </Grid>
    </>
  );
};

export default PlaylistSelect;
