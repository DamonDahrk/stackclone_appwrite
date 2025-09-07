import React from "react";
import HeroSection from "@/app/components/HeroSection";
import LatestQuestions from "@/app/components/LatestQuestions";
import TopContributers from "@/app/components/TopContributers";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <HeroSection />
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Questions - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
              Latest Questions
            </h2>
            <LatestQuestions />
          </div>
          
          {/* Sidebar with Top Contributors */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
              Top Contributors
            </h2>
            <TopContributers />
          </div>
        </div>
        
        {/* Welcome Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-neutral-900 dark:text-white">
            Welcome to StackFlow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Ask Questions</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Get help from our community of developers
              </p>
            </div>
            <div className="p-6 rounded-lg bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Share Knowledge</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Answer questions and help others grow
              </p>
            </div>
            <div className="p-6 rounded-lg bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Build Reputation</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Earn points and recognition from the community
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
