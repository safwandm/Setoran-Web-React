'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  router.push("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
     
    </div>
  );
}
