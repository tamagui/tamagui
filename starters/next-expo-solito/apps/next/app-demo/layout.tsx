'use client'

import { TamaguiProvider } from './TamaguiProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TamaguiProvider>{children}</TamaguiProvider>
      </body>
    </html>
  )
}
