
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FamilyPlansSection } from "@/components/landing/FamilyPlansSection";

export default function Index() {
  const { user } = useAuth();
  const { remainingStories, isFreeTier } = useFreeTier();

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={!!user} />
      <HeroSection 
        isFreeTier={isFreeTier} 
        remainingStories={remainingStories}
        isLoggedIn={!!user}
      />
      <BenefitsSection />
      <FamilyPlansSection />
    </div>
  );
}
