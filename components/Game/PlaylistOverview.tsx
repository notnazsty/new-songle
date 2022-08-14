import {
  VStack,
  Heading,
  HStack,
  Button,
  Image,
  Grid,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import {
  followPlaylist,
  unfollowPlaylist,
} from "../../firebase/account/following";
import { AccountCollectionDoc } from "models/firebase/account";
import React, { Dispatch, SetStateAction } from "react";
import { PlaylistCollectionDoc } from "../../models/firebase/playlists";
import SongGrid from "./SongGrid";
import Leaderboard from "./Leaderboard/Leaderboard";
import { LeaderboardCollection } from "models/firebase/leaderboard";

interface PlaylistOverviewProps {
  playlistData: PlaylistCollectionDoc;
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
  userData: AccountCollectionDoc;
  leaderboard: LeaderboardCollection;
}
const PlaylistOverview: React.FC<PlaylistOverviewProps> = ({
  playlistData,
  setGameMode,
  userData,
  leaderboard,
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

        {playlistData.images && playlistData.images.length > 0 ? (
          <Image
            src={playlistData.images[0].url}
            alt={playlistData.name}
            boxSize="sm"
          />
        ) : (
          <> </>
        )}
      </VStack>

      <Tabs
        variant="solid-rounded"
        colorScheme="green"
        my={{ base: 24, md: 2 }}
      >
        <TabList>
          <Tab> Playlist </Tab>
          <Tab> Leaderboard </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack align="start">
              <SongGrid savedTracks={playlistData.savedTracks} />
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start">
              <Leaderboard board={leaderboard} />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

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
