import { z } from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error will show under confirmPassword
  });

export const otpSchema = z.object({
  pin: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6)
    .regex(/^\d+$/, "Must be numbers only"),
});

export type OtpSchema = z.infer<typeof otpSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
