import React from "react";
import { Crosshair, BarChart2, Layers } from "lucide-react";
import { useLocale } from "../../i18n/LocaleProvider";

const Features: React.FC = () => {
  const { messages } = useLocale();

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      title: messages.home.features.items[0].title,
      description: messages.home.features.items[0].description,
    },
    {
      icon: <Crosshair className="w-6 h-6 text-pink-500" />,
      title: messages.home.features.items[1].title,
      description: messages.home.features.items[1].description,
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-emerald-500" />,
      title: messages.home.features.items[2].title,
      description: messages.home.features.items[2].description,
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-brand-600 uppercase tracking-wide mb-2">
            {messages.home.features.eyebrow}
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {messages.home.features.title}
          </p>
          <p className="text-lg text-slate-600">
            {messages.home.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
