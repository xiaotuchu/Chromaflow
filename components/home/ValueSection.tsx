import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "../../i18n/LocaleProvider";

const ValueSection: React.FC = () => {
  const { messages } = useLocale();

  return (
    <section id="value" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Visual Side - Abstract Color Wheel/Stack */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-blue-100 rounded-full blur-[100px] opacity-60"></div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl transform rotate-[-2deg]">
                  <div className="text-4xl font-bold mb-1">98%</div>
                  <div className="text-sm text-slate-400">
                    {messages.home.value.matchAccuracy}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 h-48 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 h-48 flex items-center justify-center">
                  <div className="w-full h-full rounded-xl bg-pink-50 flex items-end justify-center p-4">
                    <div className="w-8 h-16 bg-pink-300 rounded-t-md mx-1"></div>
                    <div className="w-8 h-24 bg-pink-400 rounded-t-md mx-1"></div>
                    <div className="w-8 h-12 bg-pink-200 rounded-t-md mx-1"></div>
                  </div>
                </div>
                <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl transform rotate-[2deg]">
                  <div className="text-lg font-bold">
                    {messages.home.value.rankTitle}
                  </div>
                  <div className="text-indigo-100 text-sm">
                    {messages.home.value.rankLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {messages.home.value.title}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {messages.home.value.description}
            </p>

            <ul className="space-y-6">
              {messages.home.value.items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 mt-1">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
