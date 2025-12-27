"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  VStack,
  HStack,
  Text,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const contextValue: SidebarContextType = {
    isOpen,
    isMobile: !!isMobile,
    openSidebar: onOpen,
    closeSidebar: onClose,
    toggleSidebar: onToggle,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: ReactNode;
  width?: string;
}

export function Sidebar({ children, width = "16rem" }: SidebarProps) {
  const { isMobile, isOpen, closeSidebar } = useSidebar();

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={closeSidebar} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white">
          <DrawerBody p={0}>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box
      w={width}
      minH="100vh"
      bg="gray.900"
      color="white"
      position="fixed"
      left={0}
      top={0}
      borderRight="1px solid"
      borderColor="gray.700"
      zIndex={10}
    >
      {children}
    </Box>
  );
}

export function SidebarContent({ children }: { children: ReactNode }) {
  return (
    <VStack align="stretch" spacing={0} h="100%">
      {children}
    </VStack>
  );
}

export function SidebarHeader({ children }: { children: ReactNode }) {
  return (
    <Box p={6} borderBottom="1px solid" borderColor="gray.700">
      {children}
    </Box>
  );
}

export function SidebarMenu({ children }: { children: ReactNode }) {
  return (
    <VStack align="stretch" spacing={1} p={4}>
      {children}
    </VStack>
  );
}

interface SidebarMenuItemProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarMenuItem({
  children,
  isActive = false,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <Box
      as="button"
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
      onClick={onClick}
      textAlign="left"
    >
      {children}
    </Box>
  );
}

interface SidebarMenuButtonProps {
  icon?: ReactNode;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function SidebarMenuButton({
  icon,
  children,
  href,
  onClick,
}: SidebarMenuButtonProps) {
  const { closeSidebar } = useSidebar();

  const handleClick = () => {
    if (onClick) onClick();
    closeSidebar();
  };

  const content = (
    <HStack spacing={3}>
      {icon && <Box>{icon}</Box>}
      <Text fontSize="sm" fontWeight="medium">
        {children}
      </Text>
    </HStack>
  );

  if (href) {
    // Use NextLink for client-side navigation
    const NextLink = require("next/link").default;
    return (
      <Box as={NextLink} href={href} onClick={handleClick} display="block">
        {content}
      </Box>
    );
  }

  return (
    <Box as="button" onClick={handleClick} w="full" textAlign="left">
      {content}
    </Box>
  );
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <IconButton
      aria-label="Toggle sidebar"
      icon={<HamburgerIcon />}
      onClick={toggleSidebar}
      variant="ghost"
      size="sm"
    />
  );
}

