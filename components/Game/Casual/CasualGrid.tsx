import { Grid, VStack } from "@chakra-ui/react";
import { Song } from "models/spotify/songs";
import React, { useState } from "react";
import { PaginatedList } from "react-paginated-list";
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
      <PaginatedList
        list={searchSongList}
        itemsPerPage={12}
        renderList={(list) => (
          <Grid
            w="100%"
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            gridGap={4}
          >
            {list.map((song, i) => (
              <CasualCard key={i} song={song} handleGuess={handleGuess} />
            ))}
          </Grid>
        )}
      />
    </VStack>
  );
};

export default CasualGrid;
