import { Box, Grid, Stack, VStack, Text } from "@chakra-ui/react";
import { Song } from "models/spotify/songs";
import React, { Dispatch, SetStateAction, useState } from "react";
import CasualGrid from "./CasualGrid";
import GameInfo from "./GameInfo";

interface CasualGameProps {
  songList: Song[];
  setGameMode: Dispatch<SetStateAction<"Base" | "Standard" | "Casual">>;
}

const CasualGame: React.FC<CasualGameProps> = ({ songList, setGameMode }) => {


  return (
    <Grid templateColumns={{ lg: "300px 1fr" }} gridGap={12} px={4} py={2}>
      <GameInfo correctSong={songList[0]} />
      <VStack align="start" spacing={6}>
        <Stack
          w="100%"
          direction={{ base: "column", lg: "row" }}
          align={{ base: "start", lg: "center" }}
          justify={{ lg: "space-between" }}
        >
          <Text
            flexShrink={0}
            mt={0}
            fontSize={"4xl"}
            fontWeight="bold"
            lineHeight={{ lg: 0 }}
          >
            Make a Guess!
          </Text>
          <Box w="100%" maxW={{ lg: "xl" }}>
            {/* <Searchbar /> */}
          </Box>
        </Stack>
        <CasualGrid songList={songList} />
      </VStack>
    </Grid>
  );
};

export default CasualGame;
