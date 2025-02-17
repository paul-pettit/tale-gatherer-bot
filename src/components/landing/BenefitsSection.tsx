
import { Users, BadgeDollarSign, BadgeCheck, Pen, Heart, BookOpen } from "lucide-react";

export function BenefitsSection() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tell Your Story Well
        </h2>

        {/* New explanation section */}
        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-xl text-center text-muted-foreground mb-12">
            MemoryStitcher is your personal AI-powered storytelling companion, helping you craft meaningful family narratives through guided conversations and thoughtful questions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Pen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Guided Writing</h3>
              <p className="text-muted-foreground">Interactive conversations that help you unlock and shape your memories</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Family Connection</h3>
              <p className="text-muted-foreground">Share stories with loved ones and preserve your family's legacy</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Living Library</h3>
              <p className="text-muted-foreground">Build a collection of meaningful stories that grows with your family</p>
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
