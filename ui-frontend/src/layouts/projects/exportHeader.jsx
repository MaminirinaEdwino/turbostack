import { ArrowLeft } from "lucide-react";

export default function Exportheader({ navigateTo, projectName }) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo("Project")}
            className="group p-3 rounded-2xl border border-couleur1/10 bg-white dark:bg-couleur1/50 hover:bg-couleur1 transition-all shadow-sm"
            title="Retour à la liste des projets"
          >
            <ArrowLeft
              size={20}
              className="text-couleur1 dark:text-couleur3 group-hover:text-white transition-colors"
            />
          </button>
          <div>
            <h1 className="text-4xl font-black text-couleur1 tracking-tight dark:text-couleur3/80">
              Export
            </h1>
            <p className="text-couleur1/50 font-medium dark:text-couleur3/50">
              Handle export for{" "}
              <span className="text-couleur1 font-bold dark:text-couleur3/50">
                "{projectName}"
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
