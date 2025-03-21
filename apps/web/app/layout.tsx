import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { SettingsProvider } from "./context/settings";
import { ThemeProvider } from "./_components/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="en">
      <body className={poppins.variable}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <SettingsProvider>
          <div className="flex min-h-screen w-full flex-col items-center bg-foreground">
            {children}
          </div>
        </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
