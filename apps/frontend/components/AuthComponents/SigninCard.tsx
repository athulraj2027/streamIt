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
import { signinSchema, type SigninSchema } from "@repo/validators";
import { signinUser } from "@/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInCard() {
  const router = useRouter();

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninSchema) {
    try {
      await signinUser(values.email, values.password);

      toast.success("Welcome back!");
      router.push("/"); // or dashboard
      router.refresh(); // optional: refresh server state
    } catch (error: any) {
      const message = error.message || "Invalid email or password";
      toast.error(message);
      form.setError("root", { message });
    }
  }

  return (
    <Card className="w-full max-w-sm bg-[#FAF3E1] text-[#222222] shadow-lg border border-[#F5E7C6] rounded-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">
          Sign in
        </CardTitle>
        <CardDescription className="text-center text-[#444444]">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#222222]">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      autoComplete="email"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[#222222]">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#222222]/70 hover:text-[#FF6D1F] underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      className="bg-[#F5E7C6] border-[#E2D3B5] text-[#222222] focus-visible:ring-[#FF6D1F]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Global Error (e.g. wrong credentials) */}
            {form.formState.errors.root && (
              <p className="text-red-600 text-sm font-medium text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-bold py-6 text-lg rounded-lg transition-all"
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E2D3B5]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FAF3E1] px-2 text-[#444444]">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-[#222222] text-[#222222] hover:bg-[#F5E7C6] font-medium"
        >
          Continue with Google
        </Button>

        <p className="text-center text-sm text-[#333333]">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#FF6D1F] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
