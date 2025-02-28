"use client"

import { getOrganizationDetails, getUserEmail } from "@/lib/queries";
import { Paddle, initializePaddle } from "@paddle/paddle-js";
import React, { useEffect, useState } from "react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId?: string;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  priceId,
  isPopular = false,
}) => {

  const [paddle, setPaddle] = useState<Paddle>();
  const [email, setEmail] = useState<string>();
  const [orgId, setOrgId] = useState<string>();

  useEffect(() => {
    const fetchDetails = async () => {
      const userEmail = await getUserEmail();
      const OrgId = await getOrganizationDetails();
      if (!userEmail) {
        alert("Failed to retrieve user email");
        return;
      }
      setEmail(userEmail);
      setOrgId(OrgId.id);
    };
    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddle) => setPaddle(paddle));
    fetchDetails();
  }, []);

  const handleCheckout = (priceId: string) => {
    if (!paddle) return alert("Paddle not initialized");

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: email || "" },
      customData: { orgId: orgId || "" },
      settings: {
        displayMode: "overlay",
        theme: "dark",
      },
    });
  };

  return (
    <div
      className={`
      transition-all duration-300 ease-in-out
      transform hover:scale-105 hover:shadow-xl p-6 bg-white
      rounded-lg shadow-md border-2
      ${isPopular ? "border-orange-300" : "border-gray-300"}
      hover:bg-gray-50
    `}
    >
      <div className="flex flex-row items-center space-x-2">
        <h3 className="text-2xl font-semibold mt-2">{title}</h3>
        {isPopular && (
          <span className="bg-[#F48900] text-white text-xs px-2 py-1 rounded-md inline-flex items-center justify-center">
            🔥 Popular
          </span>
        )}
      </div>
      <p className="text-4xl font-bold my-2">{price}</p>
      <p className="text-gray-500">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            ✅ {feature}
          </li>
        ))}
      </ul>
      {priceId ? (
        <button
          className="mt-4 px-4 py-2 rounded-lg w-full bg-black text-white"
          onClick={() => handleCheckout(priceId)}
        >
          Get started with {title}
        </button>
      ) :
        (
          <button
            className="mt-4 px-4 py-2 rounded-lg w-full bg-black text-white">
            Contact us for custom pricing
          </button>
        )}
    </div>
  );
};

export default PricingCard;