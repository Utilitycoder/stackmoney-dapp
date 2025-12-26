"use client";

import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { TransactionCardProps } from "@/types/dashboard";

const TransactionCard = ({
  type,
  title,
  amount,
  percentage,
}: TransactionCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "amount":
        return "💰";
      case "distributions":
        return "👥";
      case "addresses":
        return "📍";
      default:
        return "📊";
    }
  };

  const isPercentageIncreased = percentage && percentage > 0;
  const isPercentageDecreased = percentage && percentage < 0;

  return (
    <Box
      p={8}
      bg="rgba(255, 107, 0, 0.05)"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="lg"
      _hover={{
        borderColor: "brand.500",
        transform: "translateY(-2px)",
        transition: "all 0.3s",
      }}
    >
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Text fontSize="xl">{getIcon()}</Text>
            <Text color="gray.300" fontSize="sm" fontWeight="medium">
              {title}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <Box w="1" h="1" bg="gray.400" borderRadius="full" />
            <Box w="1" h="1" bg="gray.400" borderRadius="full" />
            <Box w="1" h="1" bg="gray.400" borderRadius="full" />
          </HStack>
        </Flex>

        <Flex align="center" gap={3}>
          <Text fontSize="3xl" fontWeight="bold" color="white">
            {amount}
          </Text>
          {percentage !== undefined && (
            <Box
              px={2}
              py={1}
              borderRadius="md"
              border="1px solid"
              fontSize="xs"
              bg={
                isPercentageIncreased
                  ? "rgba(5, 193, 104, 0.2)"
                  : isPercentageDecreased
                  ? "rgba(255, 90, 101, 0.2)"
                  : "transparent"
              }
              borderColor={
                isPercentageIncreased
                  ? "rgba(5, 193, 104, 0.45)"
                  : isPercentageDecreased
                  ? "rgba(255, 90, 101, 0.3)"
                  : "transparent"
              }
              color={
                isPercentageIncreased
                  ? "#05C168"
                  : isPercentageDecreased
                  ? "#FF5A65"
                  : "gray.400"
              }
            >
              {isPercentageIncreased ? "↑" : isPercentageDecreased ? "↓" : ""}
              {Math.abs(percentage)}%
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TransactionCard;

