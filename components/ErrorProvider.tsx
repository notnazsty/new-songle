import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const errorContext = createContext<{
  setErrorStatus: React.Dispatch<React.SetStateAction<number>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;
  onClose: () => void;
}>({
  setErrorStatus: () => {},
  setMessage: () => {},
  onClose: () => {},
  onOpen: () => {},
});

export const useError = () => {
  return useContext(errorContext);
};

const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errorStatus, setErrorStatus] = useState(400);
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    if (errorStatus !== 400) {
      onOpen();
    }
  }, [errorStatus, onOpen]);

  const handleRoutes = () => {
    const currentRoute = router.route;
    if (currentRoute.includes("initialize")) {
      router.back();
    }
  };

  return (
    <errorContext.Provider
      value={{
        setErrorStatus,
        setMessage,
        onOpen,
        onClose,
      }}
    >
      {children}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={"gray.300"}>
          <ModalHeader>Error </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> There was an issue processing your request. </Text>
            <Text> {`Error ${errorStatus}: ${message}`} </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRoutes();
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </errorContext.Provider>
  );
};

export default ErrorProvider;
