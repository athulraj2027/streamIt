"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema } from "@repo/validators";

const SignUpCard = () => {
  const router = useRouter();
  //   const { setSignupData } = useSignupStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const validationError = validateSignupForm({
  //       username,
  //       email,
  //       password,
  //       confirmPassword,
  //       role: undefined, // removed role
  //     });

  //     if (validationError) {
  //       setError(validationError);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const data = await signupUser(email);

  //       setSignupData({ username, email, password });

  //       toast.success("OTP sent successfully");
  //       router.push(`/verify-otp`);
  //     } catch (err) {
  //       setError("Sending OTP failed. Please try again later");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Card
      className="w-full max-w-sm tracking-tight 
             bg-[#FAF3E1] text-[#222222] 
             shadow-sm border border-[#F5E7C6]"
    >
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-[#222222]">
          Create account
        </CardTitle>

        <CardDescription className="text-sm text-[#444444]">
          Enter your details to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          {/* Username */}
          <div className="grid gap-1">
            <Label htmlFor="username" className="text-[#222222]">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="yourname123"
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-[#222222]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <Label htmlFor="password" className="text-[#222222]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1">
            <Label htmlFor="confirmPassword" className="text-[#222222]">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-semibold"
          >
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full border-[#222222] text-[#222222] hover:bg-[#F5E7C6]"
        >
          Login with Google
        </Button>

        <p className="text-sm text-[#333333]">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#FF6D1F] font-medium">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;
