import { HStack, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Fuse from "fuse.js";
import { Song } from "../../models/spotify/songs";

const fuseOptions: Fuse.IFuseOptions<Song> = {
  includeScore: true,
  keys: ["name", "artists", "album", "releaseDate"],
  threshold: 0.5,
};

interface SearchbarProps {
  songs: Song[];
  setSongList: Dispatch<SetStateAction<Song[]>>;
}

const Searchbar: React.FC<SearchbarProps> = ({ songs, setSongList }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const fuse = useMemo(() => {
    return new Fuse(songs, fuseOptions);
  }, [songs]);

  useEffect(() => {
    if (searchQuery.trim() == "") {
      setSongList(songs);
    } else {
      const results = fuse.search(searchQuery).map((val) => val.item);
      setSongList(results);
    }
  }, [fuse, searchQuery, setSongList, songs]);

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
          placeholder="Search playlist songs"
        />
      </InputGroup>
    </HStack>
  );
};

export default Searchbar;
