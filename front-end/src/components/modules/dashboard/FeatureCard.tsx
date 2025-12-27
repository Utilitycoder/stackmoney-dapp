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
      bg="white"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="xl"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
      minH="240px"
      display="flex"
      flexDirection="column"
      _hover={{
        borderColor: "brand.500",
        boxShadow: "md",
        transform: "translateY(-4px)",
        transition: "all 0.2s ease",
      }}
      transition="all 0.2s ease"
    >
      {/* Subtle gradient overlay */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="120px"
        h="120px"
        bgGradient="radial(circle, rgba(255, 107, 0, 0.08) 0%, transparent 70%)"
        borderRadius="full"
        transform="translate(30%, -30%)"
        pointerEvents="none"
      />

      <Flex direction="column" gap={4} flex={1} position="relative" zIndex={1}>
        <Flex justify="space-between" align="start">
          <Heading
            size="lg"
            color="black"
            fontWeight="semibold"
            fontSize="xl"
            letterSpacing="-0.01em"
          >
            {title}
          </Heading>
          <Text fontSize="3xl" opacity={0.7}>
            {getIcon()}
          </Text>
        </Flex>

        <Text
          color="gray.600"
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
          _hover={{ color: "brand.600" }}
          display="flex"
          alignItems="center"
          gap={2}
          mt="auto"
          transition="color 0.2s"
        >
          {linkText}
          <Text fontSize="lg" transform="translateX(0)" transition="transform 0.2s">
            →
          </Text>
        </Link>
      </Flex>
    </Box>
  );
};

export default FeatureCard;
