/**
 * Site-wide configuration.
 *
 * Edit these values to customize the platform's branding and the default
 * teacher profile. The seed script (`bun run db:seed`) reads from here so
 * the database stays in sync with this file.
 */

export const siteConfig = {
  /** Platform name shown in the header / catalog. */
  platformName: "منصة التجويد",
  platformNameEn: "Tajweed Platform",

  /** Default teacher (used by the seed script). */
  teacher: {
    name: "الشيخ تنين",
    email: "teacher@tajweed.example",
    bio: "معلّم تجويد متخصص في أحكام المدّ ومخارج الحروف.",
  },

  /** Author metadata for <head>. */
  author: "7-Dany",
} as const

export type SiteConfig = typeof siteConfig
