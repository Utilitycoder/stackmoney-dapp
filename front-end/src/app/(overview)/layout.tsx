"use client";

import { Box, Flex } from "@chakra-ui/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SidebarToggle } from "@/components/organisms/SidebarToggle";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Box
        ml={{ base: 0, md: "16rem" }}
        minH="100vh"
        pb={{ base: "80px", md: 0 }}
      >
        <Flex align="center" p={4} display={{ base: "flex", md: "none" }}>
          <SidebarToggle />
        </Flex>
        {children}
      </Box>
    </SidebarProvider>
  );
}
