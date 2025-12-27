"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Box,
  Flex,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useContext } from "react";
import HiroWalletContext from "@/providers/hiro-wallet-provider";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import {
  isDevnetEnvironment,
  isTestnetEnvironment,
} from "@/lib/contract-utils";

// Icon components - using Chakra UI icons for now
const DashboardIcon = () => (
  <Icon viewBox="0 0 22 23" w={5} h={5} color="currentColor">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.08 8.116a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM5.925 8.116a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM16.08 19.393a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM5.925 19.393a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51Z"
    />
  </Icon>
);

const DistributionIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
    />
  </Icon>
);

const StreamIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
    />
  </Icon>
);

const AirdropIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l6 2.25v9.14l-6 2.25-6-2.25V6.43l6-2.25z"
    />
  </Icon>
);

const AnalyticsIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
    />
  </Icon>
);

const HistoryIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
    />
  </Icon>
);

const HelpIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
    />
  </Icon>
);

const LogoutIcon = () => (
  <Icon viewBox="0 0 24 24" w={5} h={5} color="currentColor">
    <path
      fill="currentColor"
      d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
    />
  </Icon>
);

// Desktop menu items
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Distribution",
    url: "/distribution",
    icon: <DistributionIcon />,
  },
  {
    title: "Payment Stream",
    url: "/payment-stream",
    icon: <StreamIcon />,
  },
  {
    title: "Airdrop",
    url: "/airdrop",
    icon: <AirdropIcon />,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    title: "History",
    url: "/history",
    icon: <HistoryIcon />,
  },
  {
    title: "Help",
    url: "/support",
    icon: <HelpIcon />,
  },
];

// Mobile bottom navigation items
const mobileItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Distribute",
    url: "/distribution",
    icon: <DistributionIcon />,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    title: "History",
    url: "/history",
    icon: <HistoryIcon />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, closeSidebar } = useSidebar();
  const { mainnetAddress, testnetAddress, disconnect, isWalletConnected } =
    useContext(HiroWalletContext);
  const { currentWallet: devnetWallet } = useDevnetWallet();
  const currentWalletAddress = isDevnetEnvironment()
    ? devnetWallet?.stxAddress
    : isTestnetEnvironment()
    ? testnetAddress
    : mainnetAddress;

  const hasConnectedWallet = !!currentWalletAddress || isWalletConnected;

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="gray.900"
        borderTop="1px solid"
        borderColor="gray.700"
        zIndex={50}
        pb="env(safe-area-inset-bottom)"
      >
        <Flex as="nav" justify="space-around" align="center" py={2} px={2}>
          {mobileItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Box
                key={item.title}
                as={NextLink}
                href={item.url}
                onClick={closeSidebar}
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={2}
                px={2}
                color={isActive ? "white" : "gray.400"}
                _hover={{ color: "white" }}
                transition="color 0.2s"
              >
                <Box mb={1}>{item.icon}</Box>
                <Text fontSize="xs" fontWeight="medium">
                  {item.title}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Box>
    );
  }

  // Desktop sidebar
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <NextLink href="/" onClick={closeSidebar}>
            <HStack spacing={2}>
              <Box
                bg="brand.500"
                borderRadius="md"
                w={10}
                h={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize="lg"
              >
                SM
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="white">
                StackMoney
              </Text>
            </HStack>
          </NextLink>
        </SidebarHeader>

        <Box flex={1} overflowY="auto" py={4}>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.url;

              return (
                <Box key={item.title}>
                  <Box
                    as={NextLink}
                    href={item.url}
                    onClick={closeSidebar}
                    w="full"
                    p={3}
                    borderRadius="md"
                    bg={isActive ? "brand.500" : "transparent"}
                    color={isActive ? "white" : "gray.300"}
                    _hover={{
                      bg: isActive ? "brand.600" : "gray.800",
                      color: "white",
                    }}
                    transition="all 0.2s"
                    display="block"
                  >
                    <HStack spacing={3}>
                      <Box>{item.icon}</Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {item.title}
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              );
            })}
          </SidebarMenu>
        </Box>

        {hasConnectedWallet && (
          <Box p={4} borderTop="1px solid" borderColor="gray.700">
            <Box
              as="button"
              w="full"
              p={3}
              borderRadius="md"
              bg="transparent"
              color="gray.300"
              _hover={{
                bg: "gray.800",
                color: "white",
              }}
              transition="all 0.2s"
              onClick={() => {
                disconnect();
                closeSidebar();
              }}
              textAlign="left"
            >
              <HStack spacing={3}>
                <Box>
                  <LogoutIcon />
                </Box>
                <Text fontSize="sm" fontWeight="medium">
                  Disconnect Wallet
                </Text>
              </HStack>
            </Box>
          </Box>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

