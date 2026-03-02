import React from "react";
import { Layout } from "../components/layout/Layout";
import { HeroSection } from "../components/news/HeroSection";
import { CategorySection } from "../components/news/CategorySection";
import { TrendingSidebar } from "../components/news/TrendingSidebar";
import { DummyAd } from "../components/ads/DummyAd";
import AnimatedContent from "../components/AnimatedContent";
const Index = () => {
  return (
    <Layout>
      {/* Hero Section - High Impact */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <HeroSection />
      </div>

      {/* Main Content Area */}
     
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-24">
              <CategorySection category="national" title="National Headlines" />

              {/* Middle Ad Break */}
              <div className="py-5 flex justify-center">
                <DummyAd
                  variant="leaderboard"
                  label="Discover Premium Lifestyle"
                  sublabel="Exclusively for Chronicle Readers"
                />
              </div>

              <CategorySection category="punjab" title="Punjab Spotlight" />

              <CategorySection category="sports" title="Sports" />

              <div className="py-5 flex justify-center">
                <DummyAd
                  variant="leaderboard"
                  label="Global Business Summit 2026"
                  sublabel="Register for Early Access"
                />
              </div>

              <CategorySection category="technology" title="Tech" />
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-4 space-y-6">
              <TrendingSidebar />

              <div className="sticky top-40 space-y-6">
                <DummyAd
                  variant="rectangle"
                  label="Boost Your Portfolio"
                  sublabel="Financial Intelligence for the 1%"
                />

                {/* Square Ad Demonstration */}
                <div className="flex justify-center mt-4">
                  <DummyAd variant="square" label="Special Offer" />
                </div>

                {/* <div className="bg-zinc-900 p-8 text-white">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-accent">
                    Newsletter
                  </h3>
                  <p className="text-zinc-500 text-sm font-medium">
                    Daily Intelligence. Straight to your inbox.
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-24 pt-12 border-t-8 border-primary space-y-12">
            <CategorySection
              category="entertainment"
              title="Culture & Entertainment"
            />

            <div className="flex justify-center">
              <DummyAd
                variant="leaderboard"
                label="Experience Luxury Travel"
                sublabel="Curated Destinations Await"
              />
            </div>

            <CategorySection category="business" title="Global Business" />
          </div>
        </div>
      
    </Layout>
  );
};

export default Index;
