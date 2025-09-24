import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tamarind Mombasa Microservices</title>
        <meta
          name="description"
          content="Tamarind Mombasa Microservices Portal | A collection of services for Tamarind Mombasa operations"
        />
      </head>
      <body>
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
