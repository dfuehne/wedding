'use client';
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";

export default function AddressInputClient() {
  const [formData, setFormData] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const result = await submitForm(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Failed to save form.");
    }
  } catch (err: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    console.error(err);
  } finally {
    setLoading(false);
  }
};


if (submitted) {
  return (
    <div className="pt-14 p-6 flex justify-center items-start min-h-screen">
      <p className="text-center text-xl font-semibold">Form submitted!</p>
    </div>
  );
}


  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white rounded shadow-md w-full max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          We Will Mail it To You, Just Need Some Info
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        {Object.keys(formData).map((key) => (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}:
            <input
              type="text"
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 rounded text-white transition-colors"
          style={{ backgroundColor: "var(--primary-color)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--darker-primary-color)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-color)")}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
