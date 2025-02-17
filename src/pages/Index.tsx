
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
    <div className="min-h-screen flex flex-col">
      <Navigation isLoggedIn={!!user} />
      <HeroSection 
        isFreeTier={isFreeTier} 
        remainingStories={remainingStories}
        isLoggedIn={!!user}
      />
      <BenefitsSection />
      <FamilyPlansSection />
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>Copyright © 2025 MemoryStitcher. All rights reserved.</p>
      </footer>
    </div>
  );
}
