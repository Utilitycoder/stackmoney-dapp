"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import TransactionCards from "@/components/modules/dashboard/TransactionCards";
import FeatureCards from "@/components/modules/dashboard/FeatureCards";
import DashboardChart from "@/components/modules/dashboard/DashboardChart";

const DashboardPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <TransactionCards />
        </Box>
        <Box>
          <FeatureCards />
        </Box>
        <Box>
          <DashboardChart />
        </Box>
      </VStack>
    </Container>
  );
};

export default DashboardPage;

