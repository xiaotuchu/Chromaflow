import React from "react";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";
import { getRoutePath } from "../../routes";
import { useLocale } from "../../i18n/LocaleProvider";

const Footer: React.FC = () => {
  const { locale, messages } = useLocale();

  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Palette size={18} />
              </div>
              <span className="text-xl font-bold">Chromaflow</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              {messages.footer.tagline}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Chromaflow by Xiaotu.{" "}
            {messages.footer.rights}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link
              to={getRoutePath(locale, "privacy")}
              className="hover:text-white transition-colors"
            >
              {messages.footer.privacy}
            </Link>
            <Link
              to={getRoutePath(locale, "terms")}
              className="hover:text-white transition-colors"
            >
              {messages.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
