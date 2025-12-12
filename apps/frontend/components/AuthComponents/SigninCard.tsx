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

const SignInCard = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     try {
  //       setLoading(true);
  //       const data = await signinUser(email, password);
  //       toast.success("Signed in successfully");
  //       const role = data.user.role as string;
  //       Cookies.set("coursity_token", data.token);
  //       router.push(`/${role.toLowerCase()}`);
  //     } catch (err: any) {
  //       setError("Signing in failed. Please try again");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Card className="w-full max-w-sm tracking-tight bg-[#FAF3E1] text-[#222222] shadow-sm border border-[#F5E7C6]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-[#222222]">
          Sign in
        </CardTitle>
        <CardDescription className="text-[#444444]">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          {/* Email */}
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-[#222222]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-[#222222]">
                Password
              </Label>
              <Link
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline text-[#222222]/70"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-semibold"
          >
            {loading ? "Signing you in..." : "Sign in"}
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
          First time here?{" "}
          <Link href={`/sign-up`} className="text-[#FF6D1F] font-medium">
            Create Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
