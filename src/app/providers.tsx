"use client";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

// Video guide for setting up theme toggling:
// https://www.youtube.com/watch?v=optD7ns4ISQ
// https://www.youtube.com/watch?v=RTAJ-enfums

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="dark"
    >
      {children}
    </NextThemeProvider>
  );
}

export function ToastProvider() {
  const { theme } = useTheme();
  return (
    <Toaster
      toastOptions={{
        duration: 5000,
        style:
          theme === "light"
            ? {
                background: "#fff",
                color: "#363636",
              }
            : {
                background: "#363636",
                color: "#fff",
              },
      }}
    />
  );
}
