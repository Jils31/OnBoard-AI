import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer";
import CTAsection from "@/components/CTAsection";
import FAQsection from "@/components/FAQsection";
import Pricing from "@/components/Pricing";
import Working from "@/components/Working";
import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import HeroStatsSection from "@/components/HeroStatsSection";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <HeroSection />
      <HeroStatsSection />
      <Features />
      <Working />
      <Pricing />
      <FAQsection />
      <CTAsection />
      <Footer />
    </div>
  );
};

export default Index;
