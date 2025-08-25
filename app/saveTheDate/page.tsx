import { Metadata } from "next"
import InvitationPageClient from "./saveTheDateClient"

export const metadata: Metadata = {
  title: "Mark Your Calendars: Sep 4th!",
    icons: {
    icon: '/favicon.ico', // or '/logo.png'
  },
}

export default function SaveTheDatePage() {
  return <InvitationPageClient />;
}