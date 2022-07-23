import React from "react";
import {
  Avatar,
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


const Navbar = () => {
  const { user } = useUser();

  return (
    <HStack
      py={2}
      px={4}
      w="100%"
      align={"center"}
      justify="space-between"
      bg={"black"}
      color="gray.300"
    >
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Songle
      </Text>

      <HStack spacing={6}>
        {/* <HStack color="gray.400">
                    <Link href='https://github.com/notnazsty/songle' isExternal>Github</Link>
                </HStack> */}

        <Menu>
          <MenuButton>
            <HamburgerIcon boxSize={8} />
            {/* <Avatar boxSize={12} /> */}
          </MenuButton>
          <MenuList bg="gray.900" borderColor={"gray.700"}>
            <Center>
              <Avatar size={"xl"} />
            </Center>
            <br />
            <Center>
              {
                user && (<Text> {user.displayName? user.displayName : 'User'} </Text>)
              }
            </Center>
            <MenuDivider />
            {user == null ? ( 
              <MenuItem
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700" }}
                onClick={() => {
                  signin();
                }}
              >
                Sign In
              </MenuItem>
            ) : (
              <MenuItem
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700" }}
                onClick={() => {
                  auth.signOut();
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
              >
                View My Account
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

export default Navbar;
