import { CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import { Text, HStack, Image, Switch, VStack, Center } from "@chakra-ui/react";
import React from "react";
import { TransformedPlaylistData } from "../../../models/spotify/playlists";

interface PlaylistSelectCardProps {
  playlist: TransformedPlaylistData;
  isSelected: boolean;
  isPublic: boolean;
  togglePublicState: (id: string) => void;
  toggleSelectedState: (id: string) => void;
}

const PlaylistSelectCard: React.FC<PlaylistSelectCardProps> = ({
  playlist,
  isPublic,
  isSelected,
  togglePublicState,
  toggleSelectedState,
}) => {
  return (
    <VStack
      mx="auto"
      w="100%"
      maxW="250px"
      bg={isSelected ? "gray.600" : "gray.900"}
      spacing={0}
    >
      <HStack py={3} px={3} w="100%" justify={"start"}>
        <Text fontWeight={"bold"}>{playlist.name}</Text>
      </HStack>
      <Center pos="relative" boxSize="250px">
        {playlist.images?.length > 0 && (
          <Image
            boxSize="250px"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
        )}
        {!isSelected && (
          <Text
            pos="absolute"
            bg="blackAlpha.600"
            cursor={"pointer"}
            p={4}
            onClick={() => toggleSelectedState(playlist.id)}
          >
            Click to select for upload
          </Text>
        )}
        {isSelected && (
          <VStack
            pos="absolute"
            bg="blackAlpha.600"
            cursor={"pointer"}
            p={4}
            onClick={() => toggleSelectedState(playlist.id)}
          >
            <CheckCircleIcon boxSize={16} color="green.500" />
            <Text>Will upload</Text>
          </VStack>
        )}
        {isSelected && (
          <HStack
            p={2}
            bg="blackAlpha.400"
            justify="center"
            w="100%"
            pos="absolute"
            bottom={0}
          >
            <Text fontSize={"sm"} color={!isPublic ? "blue.300" : "gray.300"}>
              private
            </Text>
            <Switch
              isChecked={isPublic}
              onChange={() => togglePublicState(playlist.id)}
            />
            <Text fontSize={"sm"} color={isPublic ? "blue.300" : "gray.300"}>
              public
            </Text>
          </HStack>
        )}
      </Center>
    </VStack>
  );
};

export default PlaylistSelectCard;
