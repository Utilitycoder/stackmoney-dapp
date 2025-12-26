"use client";

import { Box, Flex, Text, Link, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { FeatureCardProps } from "@/types/dashboard";

const FeatureCard = ({
  link,
  title,
  imgType,
  linkText,
  description,
}: FeatureCardProps) => {
  const getIcon = () => {
    switch (imgType) {
      case "stream":
        return "💸";
      case "airdrop":
        return "🎁";
      case "distribution":
        return "📊";
      default:
        return "🚀";
    }
  };

  return (
    <Box
      p={6}
      bg="rgba(255, 107, 0, 0.05)"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="lg"
      position="relative"
      overflow="hidden"
      minH="280px"
      display="flex"
      flexDirection="column"
      _hover={{
        borderColor: "brand.500",
        transform: "translateY(-4px)",
        transition: "all 0.3s",
      }}
    >
      <Flex direction="column" gap={4} flex={1}>
        <Flex justify="space-between" align="start">
          <Heading size="lg" color="white" fontWeight="semibold">
            {title}
          </Heading>
          <Text fontSize="2xl">{getIcon()}</Text>
        </Flex>

        <Text
          color="gray.300"
          fontSize="sm"
          lineHeight="tall"
          flex={1}
          noOfLines={4}
        >
          {description}
        </Text>

        <Link
          as={NextLink}
          href={link}
          color="brand.500"
          fontWeight="semibold"
          fontSize="sm"
          _hover={{ color: "brand.400", textDecoration: "underline" }}
          display="flex"
          alignItems="center"
          gap={2}
        >
          {linkText}
          <Text>→</Text>
        </Link>
      </Flex>
    </Box>
  );
};

export default FeatureCard;

