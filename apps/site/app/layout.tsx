import { Metadata } from 'next'
import React from 'react'

import SupabaseProvider from './SupabaseProvider'
import { TamaguiProvider } from './TamaguiProvider'
import { ToastProvider } from './ToastProvider'

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Tamagui Studio',
  icons: ['/favicon.svg'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <TamaguiProvider>
            <ToastProvider>{children}</ToastProvider>
          </TamaguiProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
