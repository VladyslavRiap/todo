import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

interface LanguageWrapperProps {
  children: ReactNode;
}

const LanguageWrapper: React.FC<LanguageWrapperProps> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const supportedLngs = i18n.options.supportedLngs as string[];

    if (lang && supportedLngs.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else if (lang && !supportedLngs.includes(lang)) {
      const fallbackLng = i18n.options.fallbackLng as string;
      navigate(`/${fallbackLng}`, { replace: true });
    } else if (!lang) {
      const fallbackLng = i18n.options.fallbackLng as string;
      navigate(`/${fallbackLng}`, { replace: true });
    }
  }, [lang, i18n, navigate]);

  return <>{children}</>;
};

export default LanguageWrapper;
