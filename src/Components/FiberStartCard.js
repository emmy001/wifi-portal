import { Box, Heading, Text, Divider, Button } from "@chakra-ui/react";

// FiberStartCard Component
export default function FiberStartCard({ name, price, description, onSelect }) {
  return (
    <Box
      bg="white"
      p={{ base: "40px", md: "65px 40px 50px" }}
      borderRadius="30px"
      boxShadow="0px 10px 30px rgba(154,150,248,0.2)"
      textAlign="center"
      maxW="md"
      mx="auto"
    >
      {/* Title */}
      <Heading as="h3" size="md" color="purple.500" mb={4}>
        {name}
      </Heading>

      <Divider my={4} />

      <Text as="h3" size="md" color="purple.500" mb={4}>
        {description}
      </Text>

      <Divider my={4} />

      {/* Price */}
      <Heading as="h3" size="lg" mb={4}>
        KES {price}
      </Heading>

      <Divider my={4} />

      {/* Button */}
      <Button size="lg" colorScheme="purple" onClick={onSelect}>
        Select Package
      </Button>
    </Box>
  );
}
