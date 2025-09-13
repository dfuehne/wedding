import AddressInputClient from "./addressInputClient";
import Navbar from "@/components/Navbar/navbar";

export default function FormPage() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <main className="pt-14 p-6">
        <AddressInputClient />
      </main>
    </div>
  );
}
