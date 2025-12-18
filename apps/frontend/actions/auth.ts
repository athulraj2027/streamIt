export const sendOtp = async (email: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "Sending email failed.");
  }
  return data;
};

export const verifyOtp = async (
  otp: string,
  email: string,
  password: string,
  username: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" ,},
      credentials: "include",
      body: JSON.stringify({ otp, email, password, username }),
    }
  );

  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "OTP verification failed.");
  }

  return data;
};

export const signinUser = async (email: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "Signin failed");
  }
  return data;
};
