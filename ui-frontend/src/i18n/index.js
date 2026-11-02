import { useSelector, useDispatch } from "react-redux";
import { toggleLanguage, setLanguage } from "../appSlice";
import { translations } from "./translations";

export function useTranslation() {
  const language = useSelector((state) => state.app?.language || "fr");
  const dispatch = useDispatch();

  const t = (key, paramsOrFallback, params) => {
    if (!key) return "";
    let fallback = typeof paramsOrFallback === "string" ? paramsOrFallback : key;
    let values = typeof paramsOrFallback === "object" ? paramsOrFallback : params;

    let text = translations[language]?.[key] ?? translations["en"]?.[key] ?? fallback;

    if (values && typeof values === "object") {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), v);
      });
    }

    return text;
  };

  return {
    t,
    language,
    toggleLanguage: () => dispatch(toggleLanguage()),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
  };
}
