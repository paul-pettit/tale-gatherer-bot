
export function BenefitsSection() {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tell Your Story Well
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Collaborative Storytelling</h3>
              <p className="text-gray-600">
                Multiple family members can contribute to the same story, adding their unique perspectives.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Story Incentives</h3>
              <p className="text-gray-600">
                Encourage storytelling through gift card contributions and family rewards.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Private & Secure</h3>
              <p className="text-gray-600">
                Control who sees your stories with flexible privacy settings for family sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
