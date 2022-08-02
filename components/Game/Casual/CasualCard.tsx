import { Text, VStack, HStack, Box } from "@chakra-ui/react";
import { Song } from "models/spotify/songs";
import React from "react";

interface CasualCardProps {
  song: Song;
}

const CasualCard: React.FC<CasualCardProps> = ({ song }) => {
 
  return (
    <HStack
      w="100%"
      border="1px"
      borderColor={"gray.500"}
      rounded="md"
      overflow={"hidden"}
      cursor="pointer"
      _hover={{ borderColor: "blue.500" }}
    >
      <Box
        w="100%"
        h="100%"
        minH={{ base: "100px", lg: "160px" }}
        maxW={{ base: "100px", lg: "160px" }}
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
      <VStack align="stretch" px={4} py={2}>
        <Text fontWeight={"bold"} fontSize={{ base: "md", lg: "lg" }}>
          {song.name}
        </Text>
        <Text fontSize={{ base: "sm", lg: "md" }}>{song.album}</Text>
        <Text fontSize={{ base: "sm", lg: "md" }}>
          {song.artists.join(", ")}
        </Text>
      </VStack>
    </HStack>
  );
};

export default CasualCard;
