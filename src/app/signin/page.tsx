"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/lib/api-client/wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconLock } from "@tabler/icons-react";

export default function SignInForm() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  let apiService = ApiService.getInstance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setIsLoading(true);

    apiService.setoranApi
      .loginPost({
        loginRequest: {
          email: emailOrUsername,
          password: password,
        },
      })
      .then((res) => {
        localStorage.setItem("access_token", res.accessToken!);
        window.dispatchEvent(new Event("access_token_updated"));
        setIsLoading(false);
        router.push("/dashboard");
      })
      .catch((err) => {
        setError("Incorrect credentials");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <IconLock className="h-6 w-6 text-primary" />
            </div>
          </div>

          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>

          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={emailOrUsername}
                onChange={(e) =>
                  setEmailOrUsername(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 py-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
