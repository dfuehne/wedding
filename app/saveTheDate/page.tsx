import { Metadata } from "next"
import InvitationPageClient from "./saveTheDateClient"
import { Button } from 'components/Button/Button';
import Navbar from "@/components/Navbar/navbar";

export const metadata: Metadata = {
  title: "Mark Your Calendars: Sep 4th!",
    icons: {
    icon: '/favicon.ico', // or '/logo.png'
  },
}

export default function SaveTheDatePage() {
  return (
    <div className="min-h-screen">
                <Navbar />
                <main className="pt-14 p-6">
                  <div className="mt-4 flex justify-start items-center">
                    <Button href="/addressInput" className="ml-3">
                      Fill Out Address Here!
                    </Button>
                  </div>
                  <InvitationPageClient />
                </main>
              </div>
);}