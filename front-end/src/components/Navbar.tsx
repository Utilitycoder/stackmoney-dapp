"use client";

import { Box, Container, Flex, Link, HStack, Divider } from "@chakra-ui/react";
import { isDevnetEnvironment } from "@/lib/contract-utils";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import { DevnetWalletButton } from "./DevnetWalletButton";
import { ConnectWalletButton } from "./ConnectWallet";

export const Navbar = () => {
  const { currentWallet, wallets, setCurrentWallet } = useDevnetWallet();

  return (
    <Box as="nav" bg="white" position="absolute" top={0} left={0} right={0} zIndex={10} w="full" boxShadow="sm">
      <Container maxW="container.xl">
        <Flex justify="space-between" h={20} align="center">
          <Flex align="center">
            <Flex
              bg="brand.500"
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
              <Box fontSize="lg" fontWeight="bold" color="black" ml={4}>
                StackMoney
              </Box>
            </Link>
          </Flex>
          <HStack spacing={6} align="center">
            <HStack spacing={4} display={{ base: "none", md: "flex" }}>
              <Link
                href="#"
                color="gray.700"
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
        <Divider borderColor="rgba(255, 107, 0, 0.2)" />
      </Container>
    </Box>
  );
};
