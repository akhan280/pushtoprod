"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "@tremor/react";
import useMainStore from "../../../../lib/hooks/use-main-store";
import { useToast } from "../../../../components/ui/use-toast";
import { sendOTP } from "../../../../lib/2fa";
import { PhoneInput } from "../../../../components/ui/phone-input";
import LoadingDots from "../../../../components/ui/loading-ui/loading-dots";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginForm() {

  const [proceed, SetProceed] = useState(false)
    
  return (
    <div className="w-full max-w-sm flex flex-col items-center">
        <div>
        {
            !proceed ? (<LoginButton SetProceed={SetProceed}></LoginButton>): (<TwoFactorAuth/>)
        }
        </div>
    </div>
  )
}


type LoginButtonProps = { SetProceed: any};

function LoginButton({ SetProceed }: LoginButtonProps) {
  const { phone, setPhone } = useMainStore((state) => ({
    phone: state.phone,
    setPhone: state.setPhone,
  }));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function phoneHandler(value: any) {
    setPhone(value);
  }

  async function submitPhoneNumber() {
    setLoading(true);
    try {
      await sendOTP(phone);
      toast({ variant: "default", description: "OTP Sent Successfully" });
      SetProceed(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <Image src= "/logo.svg" width = {50} height = {50} alt = "image"></Image>
          <div className="text-2xl">Log in to Push2Prod</div>
          <PhoneInput
            type="Phone Number"
            onChange={phoneHandler}
            placeholder="Phone"
          />
          <Button onClick={submitPhoneNumber} disabled={loading || !phone}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      )}
    </div>
  );
}

function TwoFactorAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {code, phone, setCode} = useMainStore();
  const otpHandler = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, phone }),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success("OTP verified successfully!");
        router.push("/"); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Invalid OTP.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
      <Input
        type="text"
        onChange={otpHandler}
        placeholder="Enter OTP"
        value={code}
        className="text-sm font-medium text-stone-600 dark:text-stone-400"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !code}
        className="mt-4"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}
