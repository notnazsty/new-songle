import { Grid, HStack, VStack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Song } from "../../models/spotify/songs";
import Searchbar from "./Searchbar";
import SongPreview from "./SongPreview";
import { PaginatedList } from "react-paginated-list";

interface SongGridProps {
  savedTracks: Song[];
}

const SongGrid: React.FC<SongGridProps> = ({ savedTracks }) => {

  const [songList, setSongList] = useState<Song[]>([]);

  // TODO Use Styled Components To Style This


  return (
    <VStack w="100%" justifyContent={"left"}>
      <Searchbar songs={savedTracks} setSongList={setSongList}  />

      <PaginatedList
        list={songList}
        itemsPerPage={12}
        renderList={(list) => (
          <>
            <Grid
              w="100%"
              templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }}
              gridGap={4}
            >
              {list.map((song, i) => (
                <SongPreview key={i} song={song} />
              ))}
            </Grid>
          </>
        )
        
      }
      />
    
    </VStack>
  );
};

export default SongGrid;
