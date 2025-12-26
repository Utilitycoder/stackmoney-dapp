"use client";
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useContext } from "react";
import HiroWalletContext from "@/providers/hiro-wallet-provider";
import { formatStxAddress } from "@/lib/address-utils";

interface ConnectWalletButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export const ConnectWalletButton = (buttonProps: ConnectWalletButtonProps) => {
  const { children } = buttonProps;
  const {
    authenticate,
    isWalletConnected,
    mainnetAddress,
    testnetAddress,
    disconnect,
  } = useContext(HiroWalletContext);
  const currentWalletAddress =
    process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet"
      ? testnetAddress
      : mainnetAddress;

  return isWalletConnected ? (
    <Menu>
      <MenuButton
        as={Button}
        size="md"
        bg="brand.500"
        color="white"
        _hover={{
          bg: "brand.600",
        }}
      >
        <Flex gap="2" align="center">
          <Box>Connected:</Box>
          <Box>{formatStxAddress(currentWalletAddress || "")}</Box>
        </Flex>
      </MenuButton>
      <MenuList bg="white" borderColor="rgba(255, 107, 0, 0.2)" boxShadow="lg">
        <MenuItem onClick={disconnect} bg="transparent" _hover={{ bg: "gray.100" }} color="black">
          Disconnect Wallet
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button
      size="md"
      onClick={authenticate}
      data-testid="wallet-connect-button"
      bg="brand.500"
      color="white"
      _hover={{
        bg: "brand.600",
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px rgba(255, 107, 0, 0.3)",
      }}
      px={6}
      {...buttonProps}
    >
      <Flex gap="2" align="center">
        {children || "Launch App"}
      </Flex>
    </Button>
  );
};
