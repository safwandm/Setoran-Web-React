'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    // Validasi live agar tombol aktif hanya saat valid
    const isValid =
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword === password &&
      terms;

    setFormIsValid(isValid);
  }, [email, password, confirmPassword, terms]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!terms) newErrors.terms = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/signin"); // Arahkan ke halaman Sign In setelah berhasil daftar
    }, 1000);
  };

  const handleSignInRedirect = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="mr-2"
            checked={terms}
            onChange={() => setTerms(!terms)}
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              terms and conditions
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

        <button
          type="submit"
          className={`w-full text-white p-2 rounded ${
            formIsValid && !isLoading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!formIsValid || isLoading}
        >
          {isLoading ? "Creating..." : "Sign Up"}
        </button>

        <div className="w-full text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSignInRedirect}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
