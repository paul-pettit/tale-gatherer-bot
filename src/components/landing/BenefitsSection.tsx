
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
                  src="/lovable-uploads/d84bef9b-1d17-4006-9b0d-2fad44d91efa.png" 
                  alt="Illustration of people giving thumbs up with a coffee cup" 
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
