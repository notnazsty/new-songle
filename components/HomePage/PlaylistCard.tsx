import { VStack, Box, Image, Text } from "@chakra-ui/react";
import { PlaylistCollectionDoc } from "models/firebase/playlists";
import { useRouter } from "next/router";
import React from "react";

interface PlaylistCardProps {
  playlist: PlaylistCollectionDoc;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }: PlaylistCardProps) => {
  const router = useRouter();

  return (
    <VStack
      bg={"gray.900"}
      borderRadius={16}
      w={"192px"}
      spacing={0}
      cursor="pointer"
      onClick={() => router.push(`/playlist/${playlist.id}`)}
    >
      <Box
        boxSize={48}
        pos="relative"
        overflow="hidden"
        bgImage={
          playlist.images && playlist.images.length > 0
            ? playlist.images[0].url
            : ""
        }
        bgSize="contain"
        bgPos="center"
      />
      <Text fontSize="lg" textAlign={"center"} px={1} py={3}>
        {playlist.name}
      </Text>
    </VStack>
  );
};

export default PlaylistCard;
