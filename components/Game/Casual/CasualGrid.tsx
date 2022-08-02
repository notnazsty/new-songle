import { Grid, VStack } from "@chakra-ui/react";
import { Song } from "models/spotify/songs";
import React, { useEffect, useState } from "react";
import Searchbar from "../Searchbar";
import SongCard from "../SongCard";
import CasualCard from "./CasualCard";

interface CasualGridProps {
  songList: Song[];
}

const CasualGrid: React.FC<CasualGridProps> = ({ songList }) => {

  const [searchSongList, setSearchSongList] = useState(songList);

  return (
    <VStack w="100%">
      <Searchbar songs={songList} setSongList={setSearchSongList} />;
      <Grid
        w="100%"
        templateColumns={{ md: "repeat(2, 1fr)", xl: "repeat(2, 1fr)" }}
        gridGap={4}
      >
        {searchSongList.map((song, i) => (
          <CasualCard key={i} song={song} />
        ))}
      </Grid>
    </VStack>
  );
};

export default CasualGrid;
