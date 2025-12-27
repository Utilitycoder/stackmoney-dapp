"use client";

import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";
import TransactionCards from "@/components/modules/dashboard/TransactionCards";
import FeatureCards from "@/components/modules/dashboard/FeatureCards";
import DashboardChart from "@/components/modules/dashboard/DashboardChart";

const DashboardPage = () => {
  return (
    <Box
      minH="100vh"
      bg="stacks.beige"
      pt={24}
      pb={12}
      position="relative"
    >
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <Box>
            <Heading
              size="2xl"
              color="black"
              fontWeight="bold"
              mb={2}
              letterSpacing="-0.02em"
            >
              Dashboard
            </Heading>
            <Text color="gray.600" fontSize="md">
              Overview of your StackMoney activity and statistics
            </Text>
          </Box>

          {/* Transaction Cards */}
          <Box>
            <TransactionCards />
          </Box>

          {/* Feature Cards */}
          <Box>
            <FeatureCards />
          </Box>

          {/* Chart */}
          <Box>
            <DashboardChart />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
