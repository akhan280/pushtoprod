import { useEffect, useState } from "react";
import useMainStore from "../lib/hooks/use-main-store";
import { Input } from "./ui/input";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from "../lib/utils/supabase-client";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";

export function SelfHostedAI() {
  const { setPublic, setPrivate } = useMainStore();

  return (
    <div className="flex flex-col space-y-4">
      <Input
        placeholder="Public Key"
        onInput={(e) => {
          const publicKey = (e.target as HTMLInputElement).value;
          console.log("Public Key Changed:", publicKey);
          setPublic(publicKey);
        }}
      />
      <Input
        placeholder="Private Key"
        type="password"
        onInput={(e) => {
          const privateKey = (e.target as HTMLInputElement).value;
          console.log("Private Key Changed:", privateKey);
          setPrivate(privateKey);
        }}
      />
    </div>
  );
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const supabase = createClient();
export function ManagedAI() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('no user found');
      }
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-start space-y-2">
      <div>$2.99/mo</div>
      <div>(no limit)</div>
      <form action="/api/checkout_sessions" method="POST">
        <input type="hidden" name="user_id" value={user?.id || ''} />
        <input type="hidden" name="action" value="managed-ai" />
        <Button type="submit" role="link" className="bg-blue-500 text-white py-2 px-4 rounded">
          Subscribe Now
        </Button>
      </form>
    </div>
  );
}
