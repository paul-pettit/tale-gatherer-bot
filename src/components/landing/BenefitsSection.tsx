
import { Users, BadgeDollarSign, BadgeCheck, Pen, Heart, BookOpen } from "lucide-react";

export function BenefitsSection() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-3 relative z-10">
            Tell Your Story Well
          </h2>
          <div className="absolute w-32 h-32 bg-primary/30 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-0" />
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#2C1810]/20" />
            <BookOpen className="w-8 h-8 text-[#2C1810]" />
            <div className="h-[2px] w-12 bg-[#2C1810]/20" />
          </div>
        </div>

        {/* New explanation section */}
        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-xl text-center text-muted-foreground mb-16 leading-relaxed">
            MemoryStitcher is your personal AI-powered storytelling companion, helping you craft meaningful family narratives through guided conversations and thoughtful questions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 rounded-full bg-[hsl(26,60%,85%)] flex items-center justify-center mb-6 shadow-lg group-hover:bg-[hsl(26,60%,80%)] transition-colors relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <Pen className="w-10 h-10 text-[#2C1810] relative z-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Guided Writing</h3>
              <p className="text-muted-foreground leading-relaxed">Interactive conversations that help you unlock and shape your memories</p>
            </div>
            
            <div className="flex flex-col items-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 rounded-full bg-[hsl(26,60%,85%)] flex items-center justify-center mb-6 shadow-lg group-hover:bg-[hsl(26,60%,80%)] transition-colors relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse delay-150" />
                <Heart className="w-10 h-10 text-[#2C1810] relative z-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Family Connection</h3>
              <p className="text-muted-foreground leading-relaxed">Share stories with loved ones and preserve your family's legacy</p>
            </div>
            
            <div className="flex flex-col items-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 rounded-full bg-[hsl(26,60%,85%)] flex items-center justify-center mb-6 shadow-lg group-hover:bg-[hsl(26,60%,80%)] transition-colors relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse delay-300" />
                <BookOpen className="w-10 h-10 text-[#2C1810] relative z-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Living Library</h3>
              <p className="text-muted-foreground leading-relaxed">Build a collection of meaningful stories that grows with your family</p>
            </div>
          </div>
        </div>

        {/* Original cards section */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-card rounded-lg p-6 h-full shadow-sm flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <img 
                  src="/lovable-uploads/bd41d744-b989-432b-9eaa-f484190d1536.png" 
                  alt="Family working together on crafts" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Collaborative Storytelling</h3>
              <p className="text-muted-foreground mb-4">
                Multiple family members can contribute to the same story, adding their unique perspectives.
              </p>
              <Users className="h-6 w-6 text-muted-foreground mx-auto mt-auto" />
            </div>
          </div>
          <div className="text-center">
            <div className="bg-card rounded-lg p-6 h-full shadow-sm flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <img 
                  src="/lovable-uploads/14f2a7aa-5cf8-43f1-94f6-92bb2fbc17e3.png" 
                  alt="Elderly couple reading together on a bench in autumn" 
                  className="w-full h-48 object-contain rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Story Incentives</h3>
              <p className="text-muted-foreground mb-4">
                Encourage storytelling through gift card contributions and family rewards.
              </p>
              <BadgeDollarSign className="h-6 w-6 text-muted-foreground mx-auto mt-auto" />
            </div>
          </div>
          <div className="text-center">
            <div className="bg-card rounded-lg p-6 h-full shadow-sm flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <img 
                  src="/lovable-uploads/d31cdefd-326f-492c-b5be-a71ce6f4bcba.png" 
                  alt="Family protected under a secure roof" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Private & Secure</h3>
              <p className="text-muted-foreground mb-4">
                Control who sees your stories with flexible privacy settings for family sharing.
              </p>
              <BadgeCheck className="h-6 w-6 text-muted-foreground mx-auto mt-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
