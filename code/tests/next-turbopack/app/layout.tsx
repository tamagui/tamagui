import { TamaguiProvider } from './provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TamaguiProvider>{children}</TamaguiProvider>
      </body>
    </html>
  )
}
