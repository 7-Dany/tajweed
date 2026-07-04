import type { Metadata } from "next"
import { Inter, Amiri, Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/translations/provider"
import { siteConfig } from "@/site.config"
import { cn } from "@/lib/utils"

// Arabic serif font (Amiri) — used for Arabic content + slide deck
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ar",
})

// Latin sans (Inter) — UI chrome in both languages
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Latin geometric sans (Outfit) — used for English lesson/slide content
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-en",
})

export const metadata: Metadata = {
  title: "أحكام التجويد — Tajweed Slides",
  description:
    "مدود التجويد وتمارين نطق الحروف، عرض شرائح تفاعلي. Tajweed rules: elongations and letter pronunciation exercises.",
  keywords: [
    "Tajweed",
    "التجويد",
    "المدود",
    "Quran",
    "القرآن",
    "slides",
    "Next.js",
  ],
  authors: [{ name: siteConfig.author }],
}

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
      className={cn("antialiased", inter.variable, amiri.variable, outfit.variable)}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider>{children}</I18nProvider>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
