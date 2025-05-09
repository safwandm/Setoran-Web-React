'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulasi autentikasi, ganti dengan logic nyata di production
    setTimeout(() => {
      setIsLoading(false);
      // Jika login sukses, arahkan ke dashboard
      router.push("/dashboard");
    }, 1000);
  };

  const handleSignUpRedirect = () => {
    router.push("/signUp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <input
          type="text"
          placeholder="Email or Username"
          className="w-full p-2 border rounded"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="w-full text-center text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={handleSignUpRedirect}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
