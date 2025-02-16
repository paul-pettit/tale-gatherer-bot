
export function BenefitsSection() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tell Your Story Well
        </h2>
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
              <p className="text-muted-foreground">
                Multiple family members can contribute to the same story, adding their unique perspectives.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-card rounded-lg p-6 h-full shadow-sm flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <img 
                  src="/lovable-uploads/95a28528-6720-47e1-aef0-ec4de156b711.png" 
                  alt="Family enjoying pool time together" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Story Incentives</h3>
              <p className="text-muted-foreground">
                Encourage storytelling through gift card contributions and family rewards.
              </p>
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
              <p className="text-muted-foreground">
                Control who sees your stories with flexible privacy settings for family sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
