"use client";

import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <IconButton
      aria-label="Toggle sidebar"
      icon={<HamburgerIcon />}
      onClick={toggleSidebar}
      variant="ghost"
      size="sm"
      mr={2}
    />
  );
}

