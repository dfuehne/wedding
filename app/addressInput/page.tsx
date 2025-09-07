import AddressInputClient from "./addressInputClient";
import { Button } from "components/Button/Button";

export default function FormPage() {
  return (
    <div className="relative min-h-screen p-6">
      <Button href="/" className="mb-6">Take Me To ZoeDunc.com!</Button>
      <AddressInputClient />
    </div>
  );
}