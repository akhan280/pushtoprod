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

export default function SurveyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const { setUserProperty, setOnboardingStep } = useMainStore((state) => ({
    setUserProperty: state.setUserProperty,
    setOnboardingStep: state.setOnboardingStep,
  }));

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        console.log('No user found');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSiteSelection = (site: string) => {
    if (selectedSites.includes(site)) {
      setSelectedSites(selectedSites.filter((s) => s !== site));
    } else {
      setSelectedSites([...selectedSites, site]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('[SurveyPage] Submitted sites:', selectedSites);
      // Update the siteReferral field with the selected sites
      await setUserProperty("siteReferral", selectedSites, user?.id!);

      setOnboardingStep(2);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem. Try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center">
        <div className="text-2xl">How did you hear about us?</div>
        <div>Where did you see Push2Prod?</div>
      </div>
      <div className="flex flex-col items-center gap-2 mb-8">
        <Button
          id="productHunt"
          onClick={() => handleSiteSelection('Product Hunt')}
          variant = {selectedSites.includes('Product Hunt')  ? "default": "outline"}
        >
          Product Hunt
        </Button>
        <Button
          id="hackerNews"
          onClick={() => handleSiteSelection('Hacker News')}
          variant = {selectedSites.includes('Hacker News')  ? "default": "outline"}
        >
          Hacker News
        </Button>
        <Button
          id="X"
          onClick={() => handleSiteSelection('X')}
          variant = {selectedSites.includes('X')  ? "default": "outline"}
        >
          X (formerly Twitter)
        </Button>
      </div>
      {loading ? <ButtonLoading /> : <Button onClick={handleSubmit}>Next</Button>}
    </div>
  );
}
