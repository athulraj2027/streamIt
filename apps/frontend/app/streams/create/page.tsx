"use client";

import { startStream } from "@/actions/stream";
import { useStreamStore } from "@/store/streamStore";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateStreamPage() {
  const router = useRouter();
  const [formStreamName, setFormStreamName] = useState("");
  const [formStreamDescription, setFormStreamDescription] = useState("");
  const [formErrors, setFormErrors] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const setStream = useStreamStore((s) => s.setStream);

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formStreamName.trim()) {
      errors.name = "Stream name is required";
      isValid = false;
    } else if (formStreamName.trim().length < 3) {
      errors.name = "Stream name must be at least 3 characters";
      isValid = false;
    }

    if (!formStreamDescription.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formStreamDescription.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const onSubmit = async () => {
  
    if (!validateForm()) return;

    const toastId = toast.loading("Starting your stream...");
    setLoading(true);

    try {
      const streamData = {
        name: formStreamName.trim(),
        description: formStreamDescription.trim(),
      };
      const response = await startStream(streamData);
      setStream({
        id: response.stream.id,
        name: streamData.name,
        description: streamData.description,
        creatorId: response.stream.creatorId,
        isLive: true,
      });

     
      toast.success("Stream created successfully", {
        id: toastId,
      });
      router.push("/streams/broadcast");
    } catch (error: any) {
      console.error("Streaming action failed:", error);

      toast.error(error.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-20">
      <div className="w-full max-w-sm bg-[#FAF3E1] text-[#222222] shadow-lg border border-[#F5E7C6] rounded-xl">
        <div className="flex-1 lg:flex lg:items-center lg:justify-start p-6 overflow-y-auto">
          <div className="w-full">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <svg
                  className="w-12 h-12 text-[#FF6D1F] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-[#222222] font-semibold text-lg mb-1">
                  Start Your Stream
                </h3>
                <p className="text-[#222222]/60 text-sm">
                  Fill in the details below to go live
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">
                  Stream Name <span className="text-[#FF6D1F]">*</span>
                </label>
                <input
                  type="text"
                  value={formStreamName}
                  onChange={(e) => {
                    setFormStreamName(e.target.value);
                    if (formErrors.name)
                      setFormErrors({ ...formErrors, name: "" });
                  }}
                  placeholder="e.g., Gaming Session, Coding Tutorial"
                  className={`w-full px-3 py-2 border ${
                    formErrors.name ? "border-red-500" : "border-[#222222]/20"
                  } rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm`}
                  maxLength={50}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
                <p className="text-[#222222]/40 text-xs mt-1">
                  {formStreamName.length}/50 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">
                  Description <span className="text-[#FF6D1F]">*</span>
                </label>
                <textarea
                  value={formStreamDescription}
                  onChange={(e) => {
                    setFormStreamDescription(e.target.value);
                    if (formErrors.description)
                      setFormErrors({ ...formErrors, description: "" });
                  }}
                  placeholder="Tell viewers what your stream is about..."
                  rows={4}
                  className={`w-full px-3 py-2 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-[#222222]/20"
                  } rounded-lg focus:outline-none focus:border-[#FF6D1F] text-sm resize-none`}
                  maxLength={200}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.description}
                  </p>
                )}
                <p className="text-[#222222]/40 text-xs mt-1">
                  {formStreamDescription.length}/200 characters
                </p>
              </div>

              <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-[#FF6D1F] hover:bg-[#e55f18] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                Start Streaming
              </button>
              <Link
                href={`/streams`}
                className="text-blue-800 text-sm text-center"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
