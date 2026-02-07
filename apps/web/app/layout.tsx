import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ErrorTrackingProvider } from "@/components/ErrorTrackingProvider";
import { UpdateBanner } from "@/components/UpdateBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Matrx",
    template: "%s | Matrx",
  },
  description:
    "AI-powered enterprise platform for custom integrations and workflows.",
  openGraph: {
    title: "Matrx",
    description:
      "AI-powered enterprise platform for custom integrations and workflows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ErrorTrackingProvider>
          <UpdateBanner
            pollingInterval={300_000}
            checkOnRouteChange
          />
          {children}
        </ErrorTrackingProvider>
      </body>
    </html>
  );
}
