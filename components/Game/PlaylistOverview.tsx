import { VStack, Heading, HStack, Button, Image } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import SongGrid from "./SongGrid";

interface PlaylistOverviewProps {
  playlistData: PlaylistCollectionDoc;
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
}
const PlaylistOverview: React.FC<PlaylistOverviewProps> = ({
  playlistData,
  setGameMode,
}) => {
  return (
    <VStack w="100%" justifyContent={"center"}>
     

      <Heading> {playlistData.name} </Heading>

      {playlistData.images ? (
        <Image src={playlistData.images[0].url} alt={playlistData.name} boxSize='sm' />
      ) : (
        <> </>
      )}

      <VStack align="start" spacing={6}>
        {/* Paginate This */}
        <SongGrid savedTracks={playlistData.savedTracks} />
        <HStack>
          <Button colorScheme={"green"} onClick={() => setGameMode("Standard")}>
            Standard Game
          </Button>
          <Button colorScheme={"purple"} onClick={() => setGameMode("Casual")}>
            Casual Game
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default PlaylistOverview;
