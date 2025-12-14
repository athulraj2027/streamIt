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
    throw new Error(data.message || "Failed to fetch channels");
  }

  return data;
};

export const startStream = async (streamData?: StreamFormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(streamData),
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch channels");
  }

  return data;
};

export const stopStream = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to stop streaming");
  }

  return data;
};
