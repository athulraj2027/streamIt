"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSignupStore } from "@/store/signupStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtp, verifyOtp } from "@/actions/auth";
import { toast } from "sonner";
import { otpSchema, type OtpSchema } from "@repo/validators";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";

const RESEND_TIME = 60;

export function InputOTPForm() {
  const { fetchUser } = useAuth();
  const { username, email, password, clearSignupData } = useSignupStore();
  const router = useRouter();

  // ⏱ TIMER STATE (starts immediately)
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  // ⏱ Countdown logic (runs immediately on mount)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  async function onSubmit(values: OtpSchema) {
    try {
       await verifyOtp(values.pin, email, password, username);
      await fetchUser();
      clearSignupData();
      toast.success("Account verified successfully!");
      router.push("/streams");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid or expired OTP");
      form.setError("pin", { message: "Invalid OTP" });
    }
  }

  async function handleResendOtp() {
    try {
      await sendOtp(email);
      toast.success("OTP has been sent to your email address");
      setTimeLeft(RESEND_TIME);
    } catch (error) {
      console.log("error : ", error);
      toast.error("OTP resend failed");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-6 bg-[#FAF3E1] p-8 rounded-lg shadow-md text-[#222222]"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#222222] text-lg">
                One-Time Password
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="bg-[#F5E7C6] border border-[#E2D3B5] text-[#222222] text-xl w-12 h-12"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-[#444444]">
                Enter the 6-digit code sent to your email.
                <br />
                <span className="font-medium">Do not refresh the page.</span>
              </FormDescription>
              <FormMessage className="text-red-500 font-medium" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-semibold text-md py-3 text-lg"
        >
          {form.formState.isSubmitting ? "Verifying..." : "Verify Account"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleResendOtp}
          disabled={timeLeft > 0}
        >
          {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
        </Button>
      </form>
    </Form>
  );
}
