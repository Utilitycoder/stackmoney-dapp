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
import HiroWalletContext from "./HiroWalletProvider";
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
        bgGradient="linear(to-r, brand.500, brand.600)"
        color="white"
        _hover={{
          bgGradient: "linear(to-r, brand.600, brand.700)",
        }}
      >
        <Flex gap="2" align="center">
          <Box>Connected:</Box>
          <Box>{formatStxAddress(currentWalletAddress || "")}</Box>
        </Flex>
      </MenuButton>
      <MenuList bg="gray.800" borderColor="rgba(85, 70, 255, 0.2)">
        <MenuItem onClick={disconnect} bg="transparent" _hover={{ bg: "gray.700" }}>
          Disconnect Wallet
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button
      size="md"
      onClick={authenticate}
      data-testid="wallet-connect-button"
      bgGradient="linear(to-r, brand.500, brand.600)"
      color="white"
      _hover={{
        bgGradient: "linear(to-r, brand.600, brand.700)",
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px rgba(85, 70, 255, 0.3)",
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
