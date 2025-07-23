"use client";
import { useState } from "react";
import Image from "next/image";
import { Search, BadgeCheck, Globe, HandCoins } from "lucide-react";

const howItworksImages = [
  "/Search-well.webp",
  "/Evaluate-well.webp",
  "/Pay-well.webp",
  "/transparent.webp",
];

export default function How() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const steps = [
    {
      id: 0,
      icon: <Search size={40} />,
      title: "Search for matches",
      description: "Search and filter from millions of products and suppliers.",
    },
    {
      id: 1,
      icon: <BadgeCheck size={40} />,
      title: "Identify the right one",
      description: "Evaluate product quality and supplier capabilities.",
    },
    {
      id: 2,
      icon: <Globe size={40} />,
      title: "Fulfill with transparency",
      description: "Ensure smooth transactions with trusted suppliers.",
    },
    {
      id: 3,
      icon: <HandCoins size={40} />,
      title: "Pay with confidence",
      description: "Pay for your order in over 20 currencies.",
    },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col md:flex-row items-center justify-start gap-3 md:gap-30 lg mt-12 max-w-full relative">
        {/* Left Side: Steps */}
        <div className="flex flex-row md:flex-col gap-5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col md:flex-row items-center md:items-start justify-start gap-3 cursor-pointer hover:shadow-md p-4 transition-all duration-200"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                {step.icon}
              </div>
              <div>
                <h2 className="font-zen-dots text-headline text-md md:text-2xl text-center md:text-start">
                  {step.title}
                </h2>
                <p className="w-full font-montserrat text-md md:text-xl text-center md:text-start text-subHeadline hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Image */}
        <div className="flex items-center justify-center pointer-events-none">
          {hoveredIndex !== null && (
            <Image
              src={howItworksImages[hoveredIndex]}
              width={350}
              height={350}
              alt={steps[hoveredIndex].title}
              className="rounded-xl"
            />
          )}
        </div>
      </div>

      <div className="grid md:hidden items-center justify-center gap-3 max-w-[600px] mt-16">
        {steps.map((step, index) => (
          <div key={step.id} className="relative w-full h-[200px]">
            <h1 className="text-center font-zen-dots text-headline">
              {step.title}
            </h1>
            <p className="text-center">{step.description}</p>
            <Image
              src={howItworksImages[index]}
              alt={step.title}
              fill
              className="rounded-xl object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
