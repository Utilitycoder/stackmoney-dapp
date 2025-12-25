import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#E8E6FF",
      100: "#C4C0FF",
      200: "#9B95FF",
      300: "#726AFF",
      400: "#5546FF",
      500: "#5546FF", // Stacks primary purple/blue
      600: "#4338E6",
      700: "#3128CC",
      800: "#1F1AB3",
      900: "#0D0A99",
    },
    stacks: {
      primary: "#5546FF",
      secondary: "#00D4FF",
      dark: "#000000",
      light: "#FFFFFF",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#000000",
        color: "#FFFFFF",
      },
    },
  },
});

export default theme;
