import React from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import ValueSection from "../components/home/ValueSection";
import Footer from "../components/common/Footer";
import { useLocale } from "../i18n/LocaleProvider";
import { createPageSeo } from "../utils/seo";
import { usePageSeo } from "../hooks/usePageSeo";

const Home: React.FC = () => {
  const { locale } = useLocale();
  usePageSeo(createPageSeo(locale, "home"));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* 核心展示区 */}
        <Hero />

        {/* 功能与特性 */}
        <div id="features" className="relative">
          <Features />
        </div>

        {/* 价值主张 */}
        <div id="value" className="relative">
          <ValueSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
