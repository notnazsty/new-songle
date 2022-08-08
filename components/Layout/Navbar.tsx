import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useUser } from "../AuthProvider";
import { auth, userRef } from "../../firebase/firebase";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signin } from "../../firebase/signIn";
import { getDoc, doc } from "firebase/firestore";
import { AccountCollectionDoc } from "../../models/firebase/account";
import { useRouter } from "next/router";

interface Props {
  maxWidth: string;
}

const Navbar : React.FC<Props> = ({maxWidth = "6xl"}) => {
  const { user } = useUser();
  const [userData, setUserData] = useState<AccountCollectionDoc | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!userData && user) {
      getDoc(doc(userRef, user.uid)).then((data) => {
        setUserData(data.data() as AccountCollectionDoc);
      });
    }
  }, [user, userData]);

  return (
    <Box bg={"black"}>
      <HStack
        py={2}
        px={4}
        w="100%"
        maxW={maxWidth}
        mx="auto"
        align={"center"}
        justify="space-between"
        bg={"black"}
        color="gray.300"
      >
        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
          onClick={() => router.push("/")}
          cursor="pointer"
        >
          Songle
        </Text>

        <HStack spacing={6}>
          <Menu>
            <MenuButton>
              <HamburgerIcon boxSize={8} />
            </MenuButton>
            <MenuList bg="gray.900" borderColor={"gray.700"}>
              <Center pt={4}>
                <Avatar
                  size={"xl"}
                  src={
                    userData &&
                    userData.spotifyConnected &&
                    userData.spotifyProfileData
                      ? userData.spotifyProfileData.images[0].url
                      : ""
                  }
                />
              </Center>
              <Center pt={3} pb={2}>
                {user && (
                  <Text fontSize={"lg"} fontWeight="medium"> {user.displayName ? user.displayName : "User"} </Text>
                )}
              </Center>
              <MenuDivider />
              {user == null ? (
                <MenuItem
                  _hover={{ bg: "gray.700" }}
                  _focus={{ bg: "gray.700" }}
                  onClick={() => {
                    signin();
                  }}
                  fontSize="sm"
                >
                  Sign In
                </MenuItem>
              ) : (
                <MenuItem
                  _hover={{ bg: "gray.700" }}
                  _focus={{ bg: "gray.700" }}
                  fontSize="sm"

                  onClick={() => {
                    auth.signOut();
                    router.reload();
                  }}
                >
                  Sign Out
                </MenuItem>
              )}
              {user != null && (
                <MenuItem
                  _hover={{ bg: "gray.700" }}
                  _focus={{ bg: "gray.700" }}
                  onClick={() => window.open("/account", "_self")}
                  fontSize="sm"
                >
                  View My Account
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Navbar;
