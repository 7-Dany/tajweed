import { Inter, Amiri } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ar",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        amiri.variable
      )}
    >
      <body style={{ fontFamily: "var(--font-ar)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
