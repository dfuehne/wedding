import "styles/tailwind.css"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Zoe Baker and Duncan Fuehne Wedding Website!",
    icons: {
    icon: '/favicon.ico', // or '/logo.png'
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
