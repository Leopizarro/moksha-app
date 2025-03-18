import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/context/Provider";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import AppHeader from "./components/app-header/AppHeader";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moksha Creaciones - Sitio Web",
  description: "Vitrina online de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <AppHeader />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </Provider>
    </html>
  );
}
