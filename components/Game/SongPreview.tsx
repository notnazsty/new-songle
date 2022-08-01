import { HStack, Box, VStack, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Song } from "../../models/spotify/songs";

interface Props {
  song: Song;
}

const SongPreview: React.FC<Props> = ({ song }) => {
  return (
    <Tooltip label={song.name + " by " + song.artists[0]}>
      <VStack
        rounded="md"
        overflow={"hidden"}
        cursor="pointer"
        _hover={{ borderColor: "blue.500" }}
        w="100%"
        maxW="240px"
      >
        <Box
          w="100%"
          h="100%"
          minH={{ base: "160px", lg: "240px" }}
          maxW={{ base: "160px", lg: "240px" }}
          bgPos="center"
          bgSize={"cover"}
          bgImage={
            song.coverImages.length > 2
              ? song.coverImages[1].url
              : song.coverImages.length > 1
              ? song.coverImages[0].url
              : ""
          }
        ></Box>
        <Text textAlign={"center"}> {song.name} </Text>
      </VStack>
    </Tooltip>
  );
};

export default SongPreview;
