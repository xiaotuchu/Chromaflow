import React, { createContext, useContext, useEffect, useMemo } from "react";
import type { Locale } from "./config";
import { getMessages, type Messages } from "./messages";

export const LOCALE_STORAGE_KEY = "chromaflow2.locale";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  locale,
  children,
}) => {
  const value = useMemo(
    () => ({ locale, messages: getMessages(locale) }),
    [locale]
  );

  useEffect(() => {
    try { localStorage.setItem(LOCALE_STORAGE_KEY, locale); } catch { /* Practice remains usable without storage. */ }
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
