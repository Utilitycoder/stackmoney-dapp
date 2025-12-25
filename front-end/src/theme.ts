import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#FFF4E6",
      100: "#FFE0B3",
      200: "#FFCC80",
      300: "#FFB84D",
      400: "#FFA41A",
      500: "#FF6B00", // Stacks primary orange
      600: "#E55A00",
      700: "#CC4F00",
      800: "#B24400",
      900: "#993900",
    },
    stacks: {
      primary: "#FF6B00", // Primary orange
      secondary: "#FFD700", // Orange-yellow/gold accent
      accent: "#FFA41A", // Lighter orange
      beige: "#F8F7F5", // Light beige background
      dark: "#000000",
      light: "#FFFFFF",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#F8F7F5", // Stacks light beige background
        color: "#000000",
      },
    },
  },
});

export default theme;
