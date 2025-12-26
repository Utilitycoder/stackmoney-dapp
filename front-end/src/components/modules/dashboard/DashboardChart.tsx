"use client";

import { Box, Heading, Text, Spinner, SimpleGrid } from "@chakra-ui/react";
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
const getChartData = async (address: string | null): Promise<ITransactionDataPoint[]> => {
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

  const { data: chartData = [], isFetching } = useQuery<ITransactionDataPoint[]>({
    queryKey: ["dashboardChartData", currentWalletAddress],
    queryFn: () => getChartData(currentWalletAddress || null),
    enabled: !!currentWalletAddress,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isFetching) {
    return (
      <Box
        p={8}
        bg="rgba(255, 107, 0, 0.05)"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="lg"
        textAlign="center"
      >
        <Spinner size="lg" color="brand.500" />
      </Box>
    );
  }

  if (!currentWalletAddress) {
    return (
      <Box
        p={8}
        bg="rgba(255, 107, 0, 0.05)"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="lg"
        textAlign="center"
      >
        <Text color="gray.400">Connect your wallet to view transaction history</Text>
      </Box>
    );
  }

  if (chartData.length === 0) {
    return (
      <Box
        p={8}
        bg="rgba(255, 107, 0, 0.05)"
        border="1px solid"
        borderColor="rgba(255, 107, 0, 0.2)"
        borderRadius="lg"
        textAlign="center"
      >
        <Heading size="md" mb={4} color="white">
          Transaction History
        </Heading>
        <Text color="gray.400">No transaction data available yet</Text>
      </Box>
    );
  }

  // Simple chart visualization using bars
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.STX || 0, d.sBTC || 0, d.USD || 0))
  );

  return (
    <Box
      p={8}
      bg="rgba(255, 107, 0, 0.05)"
      border="1px solid"
      borderColor="rgba(255, 107, 0, 0.2)"
      borderRadius="lg"
    >
      <Heading size="md" mb={6} color="white">
        Transaction History (Last 7 Days)
      </Heading>
      <Box>
        <SimpleGrid columns={chartData.length} spacing={2} mb={4}>
          {chartData.map((data, index) => (
            <Box key={index} textAlign="center">
              <Box
                bg="brand.500"
                h={`${((data.STX || 0) / maxValue) * 100}px`}
                minH="20px"
                borderRadius="md"
                mb={2}
                _hover={{ bg: "brand.400" }}
              />
              <Text fontSize="xs" color="gray.400">
                {data.time}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <Box mt={4} pt={4} borderTop="1px solid" borderColor="rgba(255, 107, 0, 0.2)">
          <Text fontSize="sm" color="gray.400">
            Total STX: {chartData.reduce((sum, d) => sum + (d.STX || 0), 0).toLocaleString()}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardChart;

