'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Theme Provider component using next-themes
 * Handles dark/light mode switching
 */

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}