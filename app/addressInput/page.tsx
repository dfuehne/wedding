"use client";
import { useState } from "react";
import { Button } from 'components/Button/Button';

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    contact: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative min-h-screen">
  {/* Top-right button */}
    <Button href="/" className="mr-3">
      Take Me To ZoeDunc.com!
    </Button>

  {/* Centered form */}
  <div className="flex items-center justify-center min-h-screen">
    {submitted ? (
      <p className="text-center text-xl font-semibold">Form submitted!</p>
    ) : (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">We Will Mail it To You, Just Need Some Info</h2>
        
        <label>
            Name:
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

            <label>
            Street Address:
            <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

            <label>
            City:
            <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

            <label>
            State:
            <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

            <label>
            Zip:
            <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

            <label>
            Phone Number or Email:
            <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
            />
            </label>

        <button
          type="submit"
          className="py-2 px-4 rounded text-white transition-colors"
          style={{ backgroundColor: "var(--primary-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--darker-primary-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--primary-color)")
          }
        >
          Submit
        </button>
      </form>
    )}
  </div>
</div>

  );
}
