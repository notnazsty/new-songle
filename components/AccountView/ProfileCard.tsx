import { RepeatIcon } from "@chakra-ui/icons";
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
import { useUser } from "components/AuthProvider";
import { useRouter } from "next/router";
import React from "react";
import { getSpotifyData } from "utils/spotify/accountRequests";
import { AccountCollectionDoc } from "../../models/firebase/account";
import { loginURL } from "../../utils/spotify/auth";
import { userRef } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useError } from "components/ErrorProvider";

interface ProfileCardProps extends BoxProps {
  account: AccountCollectionDoc;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ account }) => {
  const router = useRouter();
  const { user, userData } = useUser();
  const { onOpen, setErrorStatus, setMessage } = useError();

  const updateProfileData = async () => {
    if (user && userData?.usersSpotifyTokenData?.accessToken) {
      const profileData = await getSpotifyData(
        userData.usersSpotifyTokenData.accessToken
      );

      if (!("status" in profileData)) {
        await updateDoc(doc(userRef, user.uid), {
          spotifyProfileData: profileData,
        });
      } else {
        setErrorStatus(profileData.status);
        setMessage(profileData.message);
        onOpen();
      }
    }
  };

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
            account.spotifyConnected &&
            account.spotifyProfileData &&
            account.spotifyProfileData.images?.length > 0
              ? account.spotifyProfileData.images[0].url
              : ""
          }
          pos={"relative"}
          name={account.displayName}
        />

        <VStack w="100%" align={"left"} justify="center">
          <Heading size={"lg"} fontFamily={"body"} textAlign="start">
            {account.displayName}{" "}
            <RepeatIcon
              boxSize={4}
              cursor="pointer"
              onClick={async () => await updateProfileData()}
            />
          </Heading>
          <Stack align={"center"} justify={"center"} direction={"row"} pt={1}>
            <Badge
              bg="gray.800"
              px={2}
              py={1}
              color="gray.300"
              fontWeight={"400"}
            >
              {account.gamesPlayed + " games played"}
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
                  : "Coming Soon"}
              </Button>
            )}
          </Stack>
        </VStack>
      </Stack>
    </Center>
  );
};

export default ProfileCard;
