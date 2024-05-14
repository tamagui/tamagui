'use client'

import { ToastProvider } from '@tamagui/toast'
import { NextTamaguiProvider } from './NextTamaguiProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTamaguiProvider>
          <ToastProvider swipeDirection="horizontal" duration={3000}>
            {children}
          </ToastProvider>
        </NextTamaguiProvider>
      </body>
    </html>
  )
}
