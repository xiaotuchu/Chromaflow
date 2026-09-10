import React from "react";
import {
  HashRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import History from "./pages/History";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import KnowledgeBase from "./pages/knowledge-base/KnowledgeBase";
import { getRoutePath, routes } from "./routes";
import {
  defaultLocale,
  detectPreferredLocale,
  getLocalizedPath,
  normalizeLocale,
  stripLocalePrefix,
} from "./i18n/config";
import { LocaleProvider, LOCALE_STORAGE_KEY } from "./i18n/LocaleProvider";

const LocaleRedirect: React.FC = () => {
  let savedLocale: string | null = null;
  try { savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY); } catch { /* Storage is optional. */ }
  const preferred = detectPreferredLocale(savedLocale, navigator.language);
  return <Navigate to={getRoutePath(preferred, "home")} replace />;
};

const LocalizedLayout: React.FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();
  const normalizedLocale = normalizeLocale(locale);

  if (locale !== normalizedLocale) {
    return (
      <Navigate
        replace
        to={getLocalizedPath(normalizedLocale, stripLocalePrefix(location.pathname))}
      />
    );
  }

  return (
    <LocaleProvider locale={normalizedLocale}>
      <Outlet />
    </LocaleProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={routes.home} element={<LocaleRedirect />} />
        <Route path="/:locale" element={<LocalizedLayout />}>
          <Route index element={<Home />} />
          <Route path="practice" element={<Practice />} />
          <Route path="profile" element={<History />} />
          <Route path="login" element={<Navigate to="../practice" replace />} />
          <Route path="signup" element={<Navigate to="../practice" replace />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="knowledge-base/:slug" element={<KnowledgeBase />} />
          <Route
            path="*"
            element={<Navigate replace to={getRoutePath(defaultLocale, "home")} />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate replace to={getRoutePath(defaultLocale, "home")} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
