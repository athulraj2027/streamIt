"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@repo/validators";
import { useSignupStore } from "@/store/signupStore";
import { sendOtp } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpCard() {
  const router = useRouter();
  const { setSignupData } = useSignupStore();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: SignupSchema) {
    try {
      await sendOtp(values.email); // sends OTP

      setSignupData({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      toast.success("Check your email! We just sent you a 6-digit code");
      router.push("/verify-otp");
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast.error(error.message || "Failed to send OTP. Try again.");
      form.setError("root", { message: "Could not send OTP" });
    }
  }

  return (
    <Card className="w-full max-w-sm bg-[#FAF3E1] text-[#222222] shadow-lg border border-[#F5E7C6] rounded-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">
          Create account
        </CardTitle>
        <CardDescription className="text-center text-[#444444]">
          Join us — it takes less than a minute
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#222222]">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yourname123"
                      autoComplete="username"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#222222]">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#222222]">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#222222]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Global Error */}
            {form.formState.errors.root && (
              <p className="text-red-600 text-sm text-center font-medium">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-bold py-6 text-lg rounded-lg transition-all"
            >
              {form.formState.isSubmitting
                ? "Sending Code..."
                : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E2D3B5]" />
          </div>
          {/* <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FAF3E1] px-2 text-[#444444]">
              Or continue with
            </span>
          </div> */}
        </div>

        {/* <Button
          variant="outline"
          className="w-full border-[#222222] text-[#222222] hover:bg-[#F5E7C6] font-medium"
        >
          Continue with Google
        </Button> */}

        <p className="text-center text-sm text-[#333333]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#FF6D1F] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
