import { Globe } from "lucide-react";
import { useTranslation } from "../i18n";

export default function LanguageToggle({ className = "" }) {
  const { language, toggleLanguage, t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      title={language === "fr" ? "Switch to English" : "Passer en Français"}
      aria-label={t("Switch language")}
      className={`z-50 flex items-center gap-2 px-3 py-2 bg-couleur1 text-white dark:bg-couleur1 dark:text-couleur3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 select-none text-xs font-bold ${className}`}
    >
      {/* <Globe size={15} className="shrink-0" /> */}
      <span className="tracking-wide">
        {language === "fr" ? "FR" : "EN"}
      </span>
      <span className="text-[10px] opacity-70 font-normal">
        {language === "fr" ? "(EN)" : "(FR)"}
      </span>
    </button>
  );
}
