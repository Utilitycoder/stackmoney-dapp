"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Box, SimpleGrid, Spinner } from "@chakra-ui/react";
import TransactionCard from "./TransactionCard";
import HiroWalletContext from "@/providers/hiro-wallet-provider";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import {
  isDevnetEnvironment,
  isTestnetEnvironment,
} from "@/lib/contract-utils";

// Mock data service - replace with actual API calls
const getDashboardStats = async (address: string | null) => {
  if (!address) {
    return {
      totalAmount: 0,
      totalAmountPercentageChange: 0,
      totalDistributions: 0,
      totalDistributionsPercentageChange: 0,
      totalFundedAddresses: 0,
      totalFundedAddressesPercentageChange: 0,
    };
  }

  // TODO: Replace with actual API call
  // For now, return mock data
  return {
    totalAmount: 125000,
    totalAmountPercentageChange: 12.5,
    totalDistributions: 45,
    totalDistributionsPercentageChange: 8.3,
    totalFundedAddresses: 320,
    totalFundedAddressesPercentageChange: 15.2,
  };
};

const formatThousandNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const TransactionCards = () => {
  const { mainnetAddress, testnetAddress } = useContext(HiroWalletContext);
  const { currentWallet: devnetWallet } = useDevnetWallet();
  const currentWalletAddress = isDevnetEnvironment()
    ? devnetWallet?.stxAddress
    : isTestnetEnvironment()
    ? testnetAddress
    : mainnetAddress;

  const { data: stats, isPending } = useQuery({
    queryKey: ["dashboardStats", currentWalletAddress],
    queryFn: () => getDashboardStats(currentWalletAddress || null),
    enabled: !!currentWalletAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  if (isPending) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="brand.500" />
      </Box>
    );
  }

  const {
    totalAmount = 0,
    totalAmountPercentageChange = 0,
    totalDistributions = 0,
    totalDistributionsPercentageChange = 0,
    totalFundedAddresses = 0,
    totalFundedAddressesPercentageChange = 0,
  } = stats || {};

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <TransactionCard
        type="amount"
        title="Total Amount Sent"
        amount={`$${formatThousandNumber(totalAmount)}`}
        percentage={totalAmountPercentageChange}
      />

      <TransactionCard
        type="distributions"
        title="Total Distributions Made"
        amount={formatThousandNumber(totalDistributions)}
        percentage={totalDistributionsPercentageChange}
      />

      <TransactionCard
        type="addresses"
        title="Total Addresses Funded"
        amount={formatThousandNumber(totalFundedAddresses)}
        percentage={totalFundedAddressesPercentageChange}
      />
    </SimpleGrid>
  );
};

export default TransactionCards;

