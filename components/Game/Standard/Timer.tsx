import { HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const [seconds, setSeconds] = useState(15);

  const [fontColor, setFontColor] = useState("green");

  useEffect(() => {
    const currentSeconds = Math.floor(timeLeft / 1000);

    if (currentSeconds < 5) {
      setFontColor("red");
    }

    setSeconds(currentSeconds);
  }, [timeLeft]);

  return (
    <HStack color={fontColor} w="100%" justifyContent={"left"}>
      <Text fontSize={"4xl"}> {seconds} </Text>
    </HStack>
  );
};

export default Timer;
