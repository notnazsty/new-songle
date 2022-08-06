import {
  VStack,
  Heading,
  HStack,
  Button,
  Image,
  Grid,
  Center,
} from "@chakra-ui/react";
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
    <Grid w="100%" templateColumns={{ lg: "500px auto" }}>
      <VStack align={"stretch"} p={4} h="100%" maxH="100vh">
        <Heading textAlign={{ base: "center", md: "start" }}>
          {" "}
          {playlistData.name}{" "}
        </Heading>

        {playlistData.images ? (
          <Image
            src={playlistData.images[0].url}
            alt={playlistData.name}
            boxSize="sm"
          />
        ) : (
          <> </>
        )}
      </VStack>

      <VStack align="start" spacing={6} p={4}>
        <SongGrid savedTracks={playlistData.savedTracks} />
      </VStack>

      <HStack pos="fixed" bottom={6} left={6}>
        <Button
          size={"lg"}
          colorScheme={"green"}
          onClick={() => setGameMode("Standard")}
        >
          Standard Game
        </Button>
        <Button
          size={"lg"}
          colorScheme={"purple"}
          onClick={() => setGameMode("Casual")}
        >
          Casual Game
        </Button>
      </HStack>
    </Grid>
  );
};

export default PlaylistOverview;
