"use client";

import {
  Box,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import HiroWalletContext from "@/providers/hiro-wallet-provider";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import {
  isDevnetEnvironment,
  isTestnetEnvironment,
} from "@/lib/contract-utils";
import { ITransactionDataPoint } from "@/types/dashboard";

// Mock chart data service - replace with actual API calls
const getChartData = async (
  address: string | null
): Promise<ITransactionDataPoint[]> => {
  if (!address) {
    return [];
  }

  // TODO: Replace with actual API call
  // For now, return mock data
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      STX: Math.floor(Math.random() * 10000) + 5000,
      sBTC: Math.random() * 10 + 5,
      USD: Math.floor(Math.random() * 50000) + 25000,
    };
  });
};

const DashboardChart = () => {
  const { mainnetAddress, testnetAddress } = useContext(HiroWalletContext);
  const { currentWallet: devnetWallet } = useDevnetWallet();
  const currentWalletAddress = isDevnetEnvironment()
    ? devnetWallet?.stxAddress
    : isTestnetEnvironment()
    ? testnetAddress
    : mainnetAddress;

  const { data: chartData = [], isFetching } = useQuery<ITransactionDataPoint[]>(
    {
      queryKey: ["dashboardChartData", currentWalletAddress],
      queryFn: () => getChartData(currentWalletAddress || null),
      enabled: !!currentWalletAddress,
      refetchOnWindowFocus: true,
      refetchInterval: 60000,
    }
  );

  if (isFetching) {
    return (
      <Box
        p={12}
        bg="white"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="xl"
        boxShadow="sm"
        textAlign="center"
        minH="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.500" fontSize="sm">
            Loading chart data...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!currentWalletAddress) {
    return (
      <Box
        p={12}
        bg="white"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="xl"
        boxShadow="sm"
        textAlign="center"
        minH="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="4xl" opacity={0.3}>
            📊
          </Text>
          <Text color="gray.500" fontSize="sm">
            Connect your wallet to view transaction history
          </Text>
        </VStack>
      </Box>
    );
  }

  if (chartData.length === 0) {
    return (
      <Box
        p={12}
        bg="white"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="xl"
        boxShadow="sm"
        textAlign="center"
        minH="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Heading size="md" color="black" fontWeight="semibold">
            Transaction History
          </Heading>
          <Text color="gray.500" fontSize="sm">
            No transaction data available yet
          </Text>
        </VStack>
      </Box>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.STX || 0, d.sBTC || 0, d.USD || 0))
  );
  const totalSTX = chartData.reduce((sum, d) => sum + (d.STX || 0), 0);

  return (
    <Box
      p={8}
      bg="white"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="xl"
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="md" color="black" fontWeight="semibold" letterSpacing="-0.01em">
            Transaction History
          </Heading>
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            Last 7 Days
          </Text>
        </Flex>

        <Box>
          <SimpleGrid columns={chartData.length} spacing={3} mb={6}>
            {chartData.map((data, index) => {
              const height = Math.max(((data.STX || 0) / maxValue) * 200, 20);
              return (
                <VStack key={index} spacing={2} align="stretch">
                  <Box
                    position="relative"
                    h="200px"
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="center"
                  >
                    <Box
                      w="full"
                      bgGradient="linear(to-t, brand.500, brand.400)"
                      borderRadius="md"
                      minH={`${height}px`}
                      maxH="200px"
                      transition="all 0.2s ease"
                      _hover={{
                        bgGradient: "linear(to-t, brand.600, brand.500)",
                        transform: "scaleY(1.05)",
                        transformOrigin: "bottom",
                      }}
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="30%"
                        bg="rgba(255, 255, 255, 0.3)"
                        borderRadius="md 0 0 0"
                      />
                    </Box>
                  </Box>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textAlign="center"
                    fontWeight="medium"
                  >
                    {data.time}
                  </Text>
                </VStack>
              );
            })}
          </SimpleGrid>

          <Box
            mt={6}
            pt={6}
            borderTop="1px solid"
            borderColor="rgba(255, 107, 0, 0.1)"
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Box w="3" h="3" bg="brand.500" borderRadius="sm" />
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  Total STX
                </Text>
              </HStack>
              <Text fontSize="lg" color="black" fontWeight="bold" letterSpacing="-0.02em">
                {totalSTX.toLocaleString()}
              </Text>
            </Flex>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default DashboardChart;
