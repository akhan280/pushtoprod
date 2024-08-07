"use client";

import LoadingDots from "@/components/loaders/loading-dots";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "@tremor/react";
import useMainStore from "../../../../lib/hooks/use-main-store";
import { useToast } from "../../../../components/ui/use-toast";
import { sendOTP } from "../../../../lib/2fa";
import { PhoneInput } from "../../../../components/ui/phone-input";

type LoginButtonProps = {
  SetProceed: any;
};
export default function LoginButton({ SetProceed }: LoginButtonProps) {
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
        <>
          <PhoneInput
            type="Phone Number"
            onChange={phoneHandler}
            placeholder="Phone"
          />
          <Button onClick={submitPhoneNumber} disabled={loading || !phone}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </>
      )}
    </div>
  );
}
