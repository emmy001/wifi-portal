import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text
} from "@chakra-ui/react";

interface Package {
  id: number;
  name: string;
  price: number;
}

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  phoneNumber: string;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PackageSelectionModal = ({
  isOpen,
  onClose,
  selectedPackage,
  phoneNumber,
  onPhoneNumberChange,
  onSubmit,
}: PackageSelectionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bgColor="transparent" // Set background to transparent
        backdropFilter="blur(10px)" // Add blur effect
        maxW="sm" // Adjust max width of the modal
        border="2px solid rgba(255, 255, 255, 0.7)" // Add border with color and width
        borderRadius="30px"
        justifyItems="center"
      >
        <ModalHeader color="white">Confirm Your Package</ModalHeader>
        <ModalBody>
          {selectedPackage ? (
            <>
              <Text fontSize="lg" color="white">
                You selected: <strong>{selectedPackage.name}</strong>
              </Text>
              <Text mb={4} color="white">Price: KES {selectedPackage.price}</Text>

              <Input
                type="text"
                placeholder="Enter your MPesa phone number"
                value={phoneNumber}
                onChange={onPhoneNumberChange}
                variant="flushed" // Optional: change input style
                color="white" // Change text color of input
              />
            </>
          ) : (
            <Text color="white">No package selected.</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="purple" mr={3} onClick={onSubmit}>
            Proceed to Pay
          </Button>
          <Button
            variant="ghost"
            /*colorScheme="white"*/
            onClick={onClose}
            sx={{
              _hover: {
                bg: "red.500", // Background color on hover
                color: "white", // Text color on hover
              },
              _focus: {
                boxShadow: "none", // Remove focus outline if desired
              },
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PackageSelectionModal;
