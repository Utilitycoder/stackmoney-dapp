"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface FeatureCardProps {
  title: string;
  description: string;
  illustration?: string;
}

const FeatureCard = ({ title, description, illustration }: FeatureCardProps) => {
  return (
    <Box
      position="relative"
      p={8}
      borderRadius="lg"
      bg="rgba(255, 107, 0, 0.05)"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      _hover={{
        borderColor: "brand.500",
        transform: "translateY(-4px)",
        transition: "all 0.3s",
      }}
      transition="all 0.3s"
    >
      <VStack align="start" spacing={4}>
        <Heading size="lg" color="black">
          {title}
        </Heading>
        <Text color="gray.700" lineHeight="tall">
          {description}
        </Text>
        <HStack>
          <Link
            color="brand.500"
            _hover={{ color: "stacks.secondary" }}
            fontSize="sm"
            fontWeight="medium"
          >
            Read more
          </Link>
          <ArrowForwardIcon color="brand.500" />
        </HStack>
        {illustration && (
          <Box mt={4} w="full">
            <Box
              w="200px"
              h="150px"
              bg="rgba(255, 107, 0, 0.1)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="brand.500"
            >
              {illustration}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const faqData = [
  {
    question: "How do I get started with StackMoney?",
    answer:
      "Getting started is easy! Simply connect your Stacks wallet (Xverse, WalletConnect, or other supported wallets), choose a feature (Token Distribution, Streaming, Emergency Crowdfunding, or AirDrop), and follow the intuitive interface to create your first transaction.",
  },
  {
    question: "What tokens can I distribute on the platform?",
    answer:
      "StackMoney supports all Stacks-compatible tokens, including STX and other SIP-010 tokens. You can distribute tokens efficiently to multiple recipients in a single transaction.",
  },
  {
    question: "How do distributions work on StackMoney?",
    answer:
      "Distributions allow you to send tokens to multiple recipients in one transaction. You can choose between equal distribution (same amount to all) or weighted distribution (custom amounts per recipient). All transactions are transparent and trackable on the Stacks blockchain.",
  },
  {
    question: "What are the fees for using StackMoney?",
    answer:
      "StackMoney uses transparent fee structures. Transaction fees are minimal and based on Stacks network fees. There are no hidden charges - you'll see the exact fee before confirming any transaction.",
  },
  {
    question: "How can I track my distributions?",
    answer:
      "All transactions are recorded on the Stacks blockchain and can be tracked in real-time. You can view transaction history, status, and details directly in the app or on Stacks block explorers.",
  },
  {
    question: "How does token streaming work?",
    answer:
      "Token streaming allows you to automate continuous crypto payouts for subscriptions, salaries, and more. Set up a stream with a recipient, amount, and duration, and the tokens will be automatically distributed over time.",
  },
];

export const LandingPage = () => {
  return (
    <Box bg="stacks.beige" minH="100vh" color="black">
      {/* Hero Section */}
      <Box
        position="relative"
        py={32}
        px={4}
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "radial(circle at center, rgba(255, 107, 0, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <Box
              position="absolute"
              top="-20%"
              left="50%"
              transform="translateX(-50%)"
              fontSize="12rem"
              fontWeight="900"
              color="rgba(255, 107, 0, 0.05)"
              letterSpacing="0.1em"
              userSelect="none"
              pointerEvents="none"
              zIndex={0}
            >
              STACKMONEY
            </Box>
            <Heading
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              zIndex={1}
              position="relative"
              color="black"
            >
              <Box as="span" display="block">
                Refining
              </Box>
              <Box as="span" display="block">
                Automated
              </Box>
              <Box as="span" display="block">
                Payments in
              </Box>
              <Box as="span" display="block" bgGradient="linear(to-r, brand.500, stacks.secondary)" bgClip="text">
                Bitcoin
              </Box>
            </Heading>
            <Text fontSize="xl" color="gray.700" maxW="2xl" zIndex={1} position="relative">
              Stream, distribute, and fundraise with ease on the Stacks blockchain
            </Text>
            <HStack spacing={4} mt={8} zIndex={1} position="relative">
              <Button
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{
                  bg: "brand.600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(255, 107, 0, 0.3)",
                }}
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="semibold"
              >
                Launch App
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} px={4} position="relative">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <FeatureCard
              title="Token Distribution"
              description="Efficiently distribute tokens to multiple recipients in one transaction. Support for both equal and weighted distribution, with transparent fee structures and real-time transaction tracking."
              illustration="📊"
            />
            <FeatureCard
              title="Streaming"
              description="Automate continuous crypto payouts, subscriptions, salaries, and more so you can focus on growth, not transfers."
              illustration="💸"
            />
            <FeatureCard
              title="Emergency Crowdfunding"
              description="When every second counts, our platform enables rapid fundraising for critical medical expenses and life-threatening emergencies. Connect with compassionate donors ready to help save lives and make a real difference."
              illustration="🚨"
            />
            <FeatureCard
              title="AirDrop"
              description="Seamlessly distribute tokens to your community with our gas-optimized airdrop tool. Supports customizable distribution rules, and automated eligibility verification—making token distribution campaigns efficient and fair."
              illustration="🎁"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box py={20} px={4} position="relative">
        <Container maxW="container.lg">
          <VStack spacing={8}>
            <Heading size="2xl" textAlign="center" mb={8} color="black">
              Frequently Asked Questions
            </Heading>
            <Accordion allowToggle w="full" defaultIndex={0}>
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  border="1px solid"
                  borderColor="rgba(255, 107, 0, 0.2)"
                  borderRadius="md"
                  mb={4}
                  bg="rgba(255, 107, 0, 0.05)"
                  _hover={{
                    borderColor: "brand.500",
                  }}
                >
                  <AccordionButton py={6} px={6}>
                    <Box flex="1" textAlign="left" fontWeight="semibold" color="black">
                      {faq.question}
                    </Box>
                    <AccordionIcon color="brand.500" />
                  </AccordionButton>
                  <AccordionPanel pb={6} px={6} color="gray.700">
                    {faq.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" py={12} px={4} borderTop="1px solid" borderColor="rgba(255, 107, 0, 0.2)">
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack spacing={6}>
              <Link
                href="https://twitter.com"
                target="_blank"
                color="gray.600"
                _hover={{ color: "brand.500" }}
              >
                X
              </Link>
              <Link
                href="https://t.me"
                target="_blank"
                color="gray.600"
                _hover={{ color: "brand.500" }}
              >
                Telegram
              </Link>
            </HStack>
            <Text color="gray.600" fontSize="sm">
              © 2025 — Copyright StackMoney
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

