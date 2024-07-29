"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "@tremor/react";
import useMainStore from "../../../../lib/hooks/use-main-store";
import { useToast } from "../../../../components/ui/use-toast";
import { sendOTP } from "../../../../lib/2fa";

export default function LoginButton() {
  const {phone, setPhone} = useMainStore((state) => ({phone: state.phone, setPhone: state.setPhone}));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast()

  function phoneHandler(event: any) {
    console.log(event.target.value);
    setPhone(event.target.value);
  }

  return (
    <div
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          <Input
            type="Phone Number"
            onChange={phoneHandler}
            placeholder="Phone"
            className="text-sm font-medium text-stone-600 dark:text-stone-400"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              
              try { 
                await sendOTP(phone);
                toast({variant: "default", description: "OTP Sent Successfully"})
                router.push('/login/2fa')
                
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                })
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !phone}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </>
      )}
    </div>
  );
}
