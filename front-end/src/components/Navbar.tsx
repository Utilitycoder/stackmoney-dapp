"use client";

import { Box, Container, Flex, Link, HStack, Divider } from "@chakra-ui/react";
import { isDevnetEnvironment } from "@/lib/contract-utils";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import { DevnetWalletButton } from "./DevnetWalletButton";
import { ConnectWalletButton } from "./ConnectWallet";

export const Navbar = () => {
  const { currentWallet, wallets, setCurrentWallet } = useDevnetWallet();

  return (
    <Box as="nav" bg="transparent" position="absolute" top={0} left={0} right={0} zIndex={10} w="full">
      <Container maxW="container.xl">
        <Flex justify="space-between" h={20} align="center">
          <Flex align="center">
            <Flex
              bgGradient="linear(to-r, brand.500, brand.600)"
              borderRadius="md"
              letterSpacing="-.05em"
              fontSize="xl"
              fontWeight="bold"
              w="52px"
              h="52px"
              justify="center"
              align="center"
              color="white"
              shrink="0"
            >
              SM
            </Flex>
            <Link href="/" textDecoration="none">
              <Box fontSize="lg" fontWeight="bold" color="white" ml={4}>
                StackMoney
              </Box>
            </Link>
          </Flex>
          <HStack spacing={6} align="center">
            <HStack spacing={4} display={{ base: "none", md: "flex" }}>
              <Link
                href="#"
                color="gray.400"
                _hover={{ color: "brand.500" }}
                fontSize="sm"
                fontWeight="medium"
              >
                Launch On Stacks
              </Link>
            </HStack>
            <Box>
              {isDevnetEnvironment() ? (
                <DevnetWalletButton
                  currentWallet={currentWallet}
                  wallets={wallets}
                  onWalletSelect={setCurrentWallet}
                />
              ) : (
                <ConnectWalletButton />
              )}
            </Box>
          </HStack>
        </Flex>
        <Divider borderColor="rgba(85, 70, 255, 0.3)" />
      </Container>
    </Box>
  );
};
