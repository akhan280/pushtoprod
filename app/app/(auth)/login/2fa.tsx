// import { useState } from "react";
// import { useRouter } from "next/router";
// import { toast } from "sonner";
// import { verifyOTP } from "../../../../lib/auth"; // Ensure this path is correct
// import { Input } from "../../../../components/ui/input";
// import { Button } from "@tremor/react";

// export default function TwoFactorAuth() {
//   const [otp, setOTP] = useState("");
  
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
  
//   const otpHandler = (event: any) => {
//     setOTP(event.target.value);
//   }

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const isVerified = await verifyOTP(otp, email);
//       if (isVerified) {
//         toast.success('OTP verified successfully!');
//         router.push('/dashboard'); // Redirect to the dashboard or desired page
//       } else {
//         toast.error('Invalid OTP.');
//       }
//     } catch (error) {
//       toast.error('Failed to verify OTP.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//       <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
//       <Input
//         type="text"
//         onChange={otpHandler}
//         placeholder="Enter OTP"
//         value={otp}
//         className="text-sm font-medium text-stone-600 dark:text-stone-400"
//       />
//       <Button
//         onClick={handleSubmit}
//         disabled={loading || !otp}
//         className="mt-4"
//       >
//         {loading ? 'Verifying...' : 'Verify OTP'}
//       </Button>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { verifyOTP } from "../../../../lib/auth"; // Ensure this path is correct
import { Input } from "../../../../components/ui/input";
import { Button } from "@tremor/react";

export default function TwoFactorAuth() {
  const [otp, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const emailFromQuery = router.query.email;
    if (emailFromQuery) {
      setEmail(emailFromQuery as string);
    }
  }, [router.query.email]);

  const otpHandler = (event: any) => {
    setOTP(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isVerified = await verifyOTP(otp, email);
      if (isVerified) {
        toast.success("OTP verified successfully!");
        router.push("/dashboard"); // Redirect to the dashboard or desired page
      } else {
        toast.error("Invalid OTP.");
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
        value={otp}
        className="text-sm font-medium text-stone-600 dark:text-stone-400"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !otp}
        className="mt-4"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}
