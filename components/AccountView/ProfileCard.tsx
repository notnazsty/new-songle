import {
  Center,
  Avatar,
  Heading,
  Stack,
  Badge,
  Button,
  BoxProps,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AccountCollectionDoc } from "../../models/firebase/account";
import { loginURL } from "../../utils/spotify/auth";

interface ProfileCardProps extends BoxProps {
  account: AccountCollectionDoc;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ account }) => {
  const router = useRouter();

  return (
    <Center py={6}>
      <Stack
        direction={["column", "row"]}
        bg={"gray.900"}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={{ base: 6, md: 10 }}
        textAlign={"center"}
        align="center"
        spacing={8}
      >
        <Avatar
          size={"2xl"}
          src={
            account.spotifyConnected && account.spotifyProfileData
              ? account.spotifyProfileData.images[0].url
              : ""
          }
          pos={"relative"}
          name={account.displayName}
        />

        <VStack w="100%" align={"left"} justify="center">
          <Heading size={"lg"} fontFamily={"body"} textAlign="start">
            {account.displayName}
          </Heading>
          <Stack align={"center"} justify={"center"} direction={"row"} pt={1}>
            <Badge
              bg="gray.800"
              px={2}
              py={1}
              color="gray.300"
              fontWeight={"400"}
            >
              {account.gameWins + account.gameLosses + " games played"}
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={"gray.800"}
              color="gray.300"
              fontWeight={"400"}
            >
              {account.gameWins + " games won"}
            </Badge>
          </Stack>

          <Stack pt={3} direction={"row"} spacing={4}>
            {!account.spotifyConnected ? (
              <Button
                colorScheme={"green"}
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                onClick={() => window.open(loginURL, "_self")}
              >
                Login to Spotify
              </Button>
            ) : (
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                onClick={() => router.push("/account/initialize")}
              >
                {account.playlistIDs.length == 0
                  ? "Load Playlists"
                  : "Reload Playlists"}
              </Button>
            )}
          </Stack>
        </VStack>
      </Stack>
    </Center>
  );
};

export default ProfileCard;
