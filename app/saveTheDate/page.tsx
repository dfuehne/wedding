import { Metadata } from "next"
import { Button } from 'components/Button/Button';
import InvitationPageClient from "./saveTheDateClient"

export const metadata: Metadata = {
  title: "Mark Your Calendars: Sep 4th!",
    icons: {
    icon: '/favicon.ico', // or '/logo.png'
  },
}

export default function SaveTheDatePage() {
  return (
    <>
      <Button href="/" className="mr-3">
        Take Me To ZoeDunc.com!
      </Button>
      <Button href="/addressInput" className="mr-3">
        I want a Physical Paper!
      </Button>
      <InvitationPageClient />
    </>
);}