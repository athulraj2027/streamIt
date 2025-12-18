"use server";
import { cookies } from "next/headers";
interface StreamFormData {
  name: string;
  description: string;
}

export const getChannels = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch channels");
  }

  return data;
};

export const startStream = async (streamData?: StreamFormData) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("streamIt_token")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(streamData),
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to create stream");
  }
  cookieStore.set("active-stream", data.stream.id, {
    httpOnly: false, // frontend can read if needed
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return data;
};

export const stopStream = async () => {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to stop streaming");
  }
  cookieStore.delete("active_stream");
  return data;
};
