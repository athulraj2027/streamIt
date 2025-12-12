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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InputOTPForm() {
  //   const { username, email, password, role, clearSignupData } = useSignupStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  //   async function onSubmit(data: z.infer<typeof FormSchema>) {
  //     try {
  //       setLoading(true);
  //       const res = await verifyOtp(data.pin, email, password, role, username);
  //       clearSignupData();
  //       Cookies.set("coursity_token", res.token);
  //       toast.success("Account verification successful");
  //       router.push(`/${role.toLowerCase()}`);
  //     } catch (error: any) {
  //       setError("Account creation failed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  return (
    <Form>
      <form className="w-2/3 space-y-6 bg-[#FAF3E1] p-6 rounded-lg shadow-md text-[#222222]">
        <FormField
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#222222]">
                One-Time Password
              </FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  pattern="[0-9]*"
                  inputMode="numeric"
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        className="bg-[#F5E7C6] border border-[#E2D3B5] text-[#222222]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-[#444444]">
                Please enter the one-time password sent to your phone. Do not
                refresh the page.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6D1F] hover:bg-[#e55f1b] text-white font-semibold"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </Form>
  );
}
