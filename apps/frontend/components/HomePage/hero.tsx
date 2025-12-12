import React from "react";
// import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center min-h-screen text-center mt-[10%] lg:mt-0 px-4 bg-[#FAF3E1]">
      <h1 className="tracking-tight text-5xl sm:text-6xl font-extrabold text-[#222222] sm:w-[60%] md:w-[50%] mx-[10%] leading-tight">
        Go Live. Build an Audience.
        <span className="text-[#FF6D1F]">Stream Without Limits.</span>
      </h1>

      <p className="text-lg sm:text-xl tracking-tight font-light text-[#222222]/80 mx-[10%] sm:w-[80%] md:w-[45%]">
        streamIt lets creators broadcast blazing-fast, low-latency streams with
        real-time chat, viewer analytics, and a modern UI — all
        <span className="text-[#FF6D1F] font-bold">
          {" "}
          powered by Next.js, Mediasoup, WebRTC, and HLS.
        </span>
      </p>

      {/* <Button className="px-12 text-white bg-[#FF6D1F] hover:bg-[#e45f1b] rounded-md shadow-md">
        Start Streaming
      </Button> */}

      <hr className="w-1/4 border-t-2 border-[#222222] opacity-20 my-6 rounded-full" />
    </div>
  );
};

export default HeroSection;
