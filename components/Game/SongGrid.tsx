import { Grid, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Song } from "../../models/spotify/songs";
import Searchbar from "./Searchbar";
import SongPreview from "./SongPreview";

interface SongGridProps {
  savedTracks: Song[];
}

const SongGrid: React.FC<SongGridProps> = ({ savedTracks }) => {
  
  const [songList, setSongList] = useState<Song[]>([]);

  return (
    <VStack w="100%" justifyContent={"left"}>
      <Searchbar songs={savedTracks} setSongList={setSongList} />
      <VStack
        px={2}
        maxHeight="calc(100vh - 140px)"
        overflowY="scroll"
        overflowX="hidden"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "grey",
            borderRadius: "24px",
          },
        }}
      >
        <Grid
          w="100%"
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(5, 1fr)",
          }}
          gridGap={4}
        >
          {songList.map((song, i) => (
            <SongPreview key={i} song={song} />
          ))}
        </Grid>
      </VStack>
    </VStack>
  );
};

export default SongGrid;
