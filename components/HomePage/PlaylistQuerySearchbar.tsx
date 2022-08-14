import { Search2Icon } from "@chakra-ui/icons";
import { HStack, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import React, { useState } from "react";

const PlaylistQuerySearchbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <HStack w="100%" color="gray.300">
      <InputGroup borderColor={"gray.800"} bg="gray.900" rounded={"md"}>
        <InputLeftElement
          // eslint-disable-next-line react/no-children-prop
          children={<Search2Icon color="gray.00" />}
        />
        <Input
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search for a playlist"
        />
      </InputGroup>
    </HStack>
  );
};

export default PlaylistQuerySearchbar;
