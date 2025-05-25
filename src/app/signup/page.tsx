'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { IconUserPlus } from "@tabler/icons-react";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const isValid =
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword === formData.password &&
      terms;

    setFormIsValid(isValid);
  }, [formData, terms]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!terms) newErrors.terms = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      router.push("/signin");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <IconUserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={terms}
                onCheckedChange={(checked) => setTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Button variant="link" className="p-0 h-auto font-normal">
                  terms and conditions
                </Button>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm font-medium text-destructive">{errors.terms}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-6 py-6">
            <Button
              type="submit"
              className="w-full"
              disabled={!formIsValid || isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-primary p-0 h-auto font-normal"
                onClick={() => router.push("/signin")}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}