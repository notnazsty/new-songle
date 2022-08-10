import { Grid, VStack } from "@chakra-ui/react";
import { Song } from "models/spotify/songs";
import React, { useState } from "react";
import Searchbar from "../Searchbar";
import CasualCard from "./CasualCard";

interface CasualGridProps {
  songList: Song[];
  handleGuess: (guess: Song) => void;
}

const CasualGrid: React.FC<CasualGridProps> = ({ songList, handleGuess }) => {
  const [searchSongList, setSearchSongList] = useState(songList);

  return (
    <VStack w="100%" align={"stretch"}>
      <Searchbar songs={songList} setSongList={setSearchSongList} />;
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
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          gridGap={4}
        >
          {songList.map((song, i) => (
            <CasualCard key={i} song={song} handleGuess={handleGuess} />
          ))}
        </Grid>
      </VStack>
    </VStack>
  );
};

export default CasualGrid;
