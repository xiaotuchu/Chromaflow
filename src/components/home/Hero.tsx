import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";
import { getRoutePath } from "../../routes";
import { useLocale } from "../../i18n/LocaleProvider";

const Hero: React.FC = () => {
  const { locale, messages } = useLocale();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {messages.home.hero.badge}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              {messages.home.hero.titlePrefix} <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {messages.home.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {messages.home.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to={getRoutePath(locale, "practice")}>
                <Button size="lg" className="group">
                  {messages.home.hero.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Interactive Element (Abstract Representation) */}
          <div className="flex-1 w-full max-w-md lg:max-w-full relative">
            <div className="relative aspect-square md:aspect-[4/3] w-full">
              {/* Main Card */}
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col p-6 animate-float z-20">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm font-semibold text-slate-400">
                    {messages.home.hero.target}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {messages.home.hero.match}
                  </div>
                </div>

                {/* The "Game" Visual */}
                <div className="flex-1 flex gap-4">
                  <div className="flex-1 rounded-2xl bg-[#6366f1] shadow-inner relative overflow-hidden group">
                    <span className="absolute bottom-4 left-4 text-white/50 text-xs font-mono">
                      #6366F1
                    </span>
                  </div>
                  <div className="flex-1 rounded-2xl bg-[#6064e8] shadow-inner relative border-4 border-dashed border-slate-200 group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 backdrop-blur px-3 py-1 rounded text-white text-xs font-medium">
                        {messages.home.hero.yourMatch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls UI */}
                <div className="mt-8 space-y-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-slate-900 rounded-full"></div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Decorative floating cards behind */}
              <div
                className="absolute -top-10 -right-10 w-48 h-48 bg-pink-500 rounded-3xl shadow-xl z-10 opacity-80 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute -bottom-5 -left-5 w-40 h-40 bg-indigo-500 rounded-3xl shadow-xl z-10 opacity-80 animate-float"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
