import { Center, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const [seconds, setSeconds] = useState(15);
  const [ds, setDs] = useState(0);

  const [color, setColor] = useState("green");

  useEffect(() => {
    const currentSeconds = Math.floor(timeLeft / 1000);
    const currentDs = (timeLeft % 1000) / 10;

    if (currentSeconds < 5) {
      setColor("red");
    } else {
      setColor("green.500");
    }

    setSeconds(currentSeconds);
    setDs(currentDs);
  }, [timeLeft]);

  return (
    <Center
      w="100%"
      borderColor={color}
      borderWidth="1px"
      boxSize="100px"
      rounded={"full"}
    >
      <Text color={color} fontSize={"3xl"}>
        {" "}
        {`${seconds}.${ds}`}{" "}
      </Text>
    </Center>
  );
};

export default Timer;
