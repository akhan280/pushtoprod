"use client";

import { AvatarImage } from "@radix-ui/react-avatar";
import { Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "../../../../components/ui/plate-ui/avatar";
import { Button } from "../../../../components/ui/button";

export default function CheckoutPage() {
  const features = [
    "Fine tuned model for generating product hunt, hacker news, and other launches based on 1,000+ successful launches",
    "Custom site domain",
    "Excalidraw & Prisma Visualizer",
    "Live portfolio",
  ];

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col space-y-4">
        <div>
          Push2Prod is a one-time purchase. You get all the features today, and
          tomorrow
        </div>
        {features.map((feature, index) => (
          <div key={index} className="flex flex-row items-center space-x-2">
            <Check />
            <div>{feature}</div>
          </div>
        ))}
        <Button className="max-w-xs rounded-2xl">Get License</Button>
      </div>
      <div>this will be a video player</div>

        <div className="absolute right-0 bottom-0 p-12">
            <QuoteComponent></QuoteComponent>
        </div>
    </div>
  );
}

function QuoteComponent() {
  return (
    <div className="flex flex-col">
      <div className="max-w-md">
        This is the last portfolio I’ve ever had to pay for. No subscriptions,
        no bloat, no vendor lock. Just good freaking software. Huge kudos to the
        team{" "}
      </div>
      <div className="flex flex-row items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://avatars.githubusercontent.com/u/35405856?s=400&u=30a5a0ac87f10d1c58ee8bc7e3bbcab2a868bc4e&v=4" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>

        <div>@areebkhan280</div>
      </div>
    </div>
  );
}
