"use client";

import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { TransactionCardProps } from "@/types/dashboard";

// Icon components
const ViewIcon = () => (
  <Box
    w="10"
    h="10"
    borderRadius="lg"
    bg="brand.500"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontWeight="bold"
    fontSize="lg"
  >
    $
  </Box>
);

const UserIcon = () => (
  <Box
    w="10"
    h="10"
    borderRadius="lg"
    bg="blue.500"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontWeight="bold"
    fontSize="lg"
  >
    👥
  </Box>
);

const PlusIcon = () => (
  <Box
    w="10"
    h="10"
    borderRadius="lg"
    bg="green.500"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontWeight="bold"
    fontSize="lg"
  >
    +
  </Box>
);

const TransactionCard = ({
  type,
  title,
  amount,
  percentage,
}: TransactionCardProps) => {
  const Icon =
    type === "amount" ? (
      <ViewIcon />
    ) : type === "distributions" ? (
      <UserIcon />
    ) : (
      <PlusIcon />
    );

  const isPercentageIncreased = percentage && percentage > 0;
  const isPercentageDecreased = percentage && percentage < 0;

  return (
    <Box
      p={6}
      bg="white"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="xl"
      boxShadow="sm"
      _hover={{
        borderColor: "brand.500",
        boxShadow: "md",
        transform: "translateY(-2px)",
        transition: "all 0.2s ease",
      }}
      transition="all 0.2s ease"
    >
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            {Icon}
            <Text color="gray.700" fontSize="sm" fontWeight="medium">
              {title}
            </Text>
          </HStack>

          <HStack spacing={1}>
            <Box w="1.5" h="1.5" bg="gray.300" borderRadius="full" />
            <Box w="1.5" h="1.5" bg="gray.300" borderRadius="full" />
            <Box w="1.5" h="1.5" bg="gray.300" borderRadius="full" />
          </HStack>
        </Flex>

        <Flex align="center" gap={3} flexWrap="wrap">
          <Text fontSize="3xl" fontWeight="bold" color="black" letterSpacing="-0.02em">
            {amount}
          </Text>
          {percentage !== undefined && (
            <Box
              px={2.5}
              py={1}
              borderRadius="md"
              border="1px solid"
              fontSize="xs"
              fontWeight="semibold"
              display="flex"
              alignItems="center"
              gap={1}
              bg={
                isPercentageIncreased
                  ? "green.50"
                  : isPercentageDecreased
                  ? "red.50"
                  : "gray.50"
              }
              borderColor={
                isPercentageIncreased
                  ? "green.200"
                  : isPercentageDecreased
                  ? "red.200"
                  : "gray.200"
              }
              color={
                isPercentageIncreased
                  ? "green.700"
                  : isPercentageDecreased
                  ? "red.700"
                  : "gray.600"
              }
            >
              <Text as="span">
                {isPercentageIncreased ? "↑" : isPercentageDecreased ? "↓" : ""}
              </Text>
              <Text as="span">{Math.abs(percentage)}%</Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TransactionCard;
