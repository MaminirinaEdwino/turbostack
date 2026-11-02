import { useTranslation } from "../i18n";
export default function LayoutHeader({ layoutName }) {
  const { t } = useTranslation();
    return <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-couleur1" >{t(layoutName)}</h1>
    </header>
}