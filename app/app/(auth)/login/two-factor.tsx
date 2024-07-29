
"use client"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "../../../../components/ui/input";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import useMainStore from "../../../../lib/hooks/use-main-store";

export default function TwoFactorAuth() {
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
        router.push("/dashboard"); // Redirect to the dashboard or desired page
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
