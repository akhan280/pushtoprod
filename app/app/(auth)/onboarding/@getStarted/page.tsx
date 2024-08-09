"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import useMainStore from "../../../../../lib/hooks/use-main-store";
import { createClient } from "../../../../../lib/utils/supabase-client";
import { User } from "@supabase/supabase-js";
import { ButtonLoading } from "../../../../../components/ui/loading-ui/button-loading";
import { toast } from "../../../../../components/ui/use-toast";


const supabase = createClient();

export default function GetStarted() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const { setUserProperty, setOnboardingStep} = useMainStore((state) => ({
        setUserProperty: state.setUserProperty,
        setOnboardingStep: state.setOnboardingStep,
    }));

    useEffect(() => {
        setLoading(true)
        async function fetchUser() {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.log('no user found')
          }
          setUser(user);
        }
        fetchUser();
        setLoading(false)
      }, []);
    

    const handleSubmit = async () => {
        setLoading(true)
        const name = (document.getElementById("name-input") as HTMLInputElement).value;
        const email = (document.getElementById("email-input") as HTMLInputElement).value;

        console.log('[getStarted] Submitted', name, email)

        try {
            await setUserProperty("name", name, user?.id!);  
            await setUserProperty("email", email, user?.id!);

            setOnboardingStep(1);
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem. Try again",
              });
            }
        setLoading(false)
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
                <div className="text-2xl">Let’s get started</div>
                <div>What’s your name and email?</div>
            </div>
            <div className="flex flex-col items-center gap-2 mb-8">
                <Input id="name-input" placeholder="Name"></Input>
                <Input id="email-input" placeholder="Email"></Input>
            </div>
            {loading ? <ButtonLoading></ButtonLoading> : <Button onClick={handleSubmit}>Next</Button>}
        </div>
    );
}
