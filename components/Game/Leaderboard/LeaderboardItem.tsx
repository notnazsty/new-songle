import { Avatar, HStack, Text } from "@chakra-ui/react";
import { LeaderboardScores } from "models/firebase/leaderboard";
import React from "react";

interface LeaderboardItemProps {
  score: LeaderboardScores;
  position: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  score,
  position,
}) => {
  return (
    <HStack
      w="100%"
      _hover={{ backgroundColor: "gray.700" }}
      backgroundColor="gray.800"
      rounded={"2xl"}
      p={2}
      justifyContent="space-between"
    >
      <HStack spacing={{ base: 2, md: 4 }}>
        <Text fontSize={{ base: "xl", md: "3xl" }}> {position + 1}. </Text>
        <Avatar
          size={"lg"}
          src={score.image ? score.image.url : undefined}
          pos={"relative"}
          name={score.name}
        />
        <Text fontSize="2xl"> {score.name} </Text>
      </HStack>
      <HStack px={{base: 4, md: 8 }} >
        <Text color='white' fontSize={'4xl'}> {score.score} </Text>
      </HStack>
    </HStack>
  );
};

export default LeaderboardItem;
