import { Provider } from "@/components/ui/provider";

import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <Flex bg={"gray.muted"} as={"nav"} justify="space-between" w="full" px={"5"} py="3" shadow={"md"}>
            <Heading>Admin UI</Heading>
            <ColorModeButton />
          </Flex>
          <Container fluid as={"main"} maxW="breakpoint-xl" px={1} py={4}>
            {children}
          </Container>
        </Provider>
      </body>
    </html>
  );
}
