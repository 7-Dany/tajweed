"use client"

import { SettingsDialog } from "@/components/settings/settings-dialog"

/**
 * Floating settings button at the bottom-start corner.
 * "Start" = right in RTL (Arabic), left in LTR (English).
 * Opens a dialog with language + theme settings.
 */
export function ControlsBar() {
  return (
    <div className="fixed bottom-4 inset-s-4 z-40">
      <SettingsDialog />
    </div>
  )
}
