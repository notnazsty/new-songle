import { Center, HStack, Text, VStack } from "@chakra-ui/react";
import { LeaderboardCollection } from "models/firebase/leaderboard";
import React from "react";
import LeaderboardItem from "./LeaderboardItem";

interface LeaderboardProps {
  board: LeaderboardCollection;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ board }) => {
  return (
    <VStack w="100%" my={4}>
      {/* Add A Leaderbord Header */}

      {board.top.map((score, i) => {
        if (i < 10) {
          return <LeaderboardItem score={score} key={i} position={i} />;
        }
      })}
      {board.top.length == 0 && (
        <Text textAlign={"left"} w="100%">
          No scores to display.
        </Text>
      )}
    </VStack>
  );
};

export default Leaderboard;
