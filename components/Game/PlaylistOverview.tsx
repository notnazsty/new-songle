import {
  VStack,
  Heading,
  HStack,
  Button,
  Image,
  Grid,
  Badge,
} from "@chakra-ui/react";
import {
  followPlaylist,
  unfollowPlaylist,
} from "../../firebase/account/following";
import { AccountCollectionDoc } from "models/firebase/account";
import React, { Dispatch, SetStateAction } from "react";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import SongGrid from "./SongGrid";

interface PlaylistOverviewProps {
  playlistData: PlaylistCollectionDoc;
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
  userData: AccountCollectionDoc;
}
const PlaylistOverview: React.FC<PlaylistOverviewProps> = ({
  playlistData,
  setGameMode,
  userData,
}) => {
  return (
    <Grid w="100%" templateColumns={{ lg: "500px auto" }}>
      <VStack align={"stretch"} p={4} h="100%" maxH="100vh">
        <HStack w="100%" alignItems={"center"}>
          <Heading textAlign={{ base: "center", md: "start" }}>
            {playlistData.name}
          </Heading>
          {userData.playlistIDs.includes(
            playlistData.id.substring(0, playlistData.id.indexOf("_"))
          ) ? (
            <Badge
              colorScheme={"green"}
              rounded="2xl"
              fontSize={12}
              cursor={"pointer"}
              onClick={() => {
                unfollowPlaylist(playlistData.id, userData.id);
              }}
            >
              Following
            </Badge>
          ) : (
            <Badge
              colorScheme={"purple"}
              rounded="2xl"
              fontSize={12}
              cursor={"pointer"}
              onClick={() => {
                followPlaylist(playlistData.id, userData.id);
              }}
            >
              Follow
            </Badge>
          )}
        </HStack>

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
