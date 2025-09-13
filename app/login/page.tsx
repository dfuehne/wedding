// app/login/page.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


const PASSWORD = "zoe"; // same as in middleware

const Login = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      // Set cookie for the domain
      document.cookie = `protected-auth=${PASSWORD}; path=/; max-age=86400`; // 1 day
      router.push("/"); // redirect to protected page
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Please Authenticate Yourself!</h2>
      <h2>Password is Zoe's Middle Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
