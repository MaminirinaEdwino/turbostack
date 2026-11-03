import React, { useState } from "react";

export default function HelpDocumentation({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState("overview");

  if (!isOpen) return null;

  const sections = [
    { id: "overview", title: "Introduction TurboStack" },
    { id: "dbeditor", title: "Base de données" },
    { id: "api", title: "Éditeur d'API" },
    { id: "pages", title: "Pages web" },
    { id: "export", title: "Exportation" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-2 md:p-4 transition-all">
      {/* Conteneur principal */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[90vh] md:h-[85vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Bouton Fermer (fixe en haut à droite sur mobile pour un accès facile) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors z-20 cursor-pointer"
          title="Fermer"
        >
          ✕
        </button>

        {/* Barre Latérale (Menu) - Passe en mode horizontal compact ou liste scrollable sur mobile */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Documentation
            </h2>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 md:p-3 gap-1 scrollbar-none">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`whitespace-nowrap md:whitespace-normal w-auto md:w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Zone de Contenu */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
            {/* Contenu dynamique selon la section */}
            {activeSection === "overview" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Introduction à TurboStack</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  TurboStack est un outil simple et intuitif conçu pour vous aider à créer des applications facilement. Grâce à son interface visuelle, vous pouvez concevoir vos projets complets sans avoir à écrire de lignes de code complexes.
                </p>
                <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-xs md:text-sm text-indigo-800 dark:text-indigo-300">
                  <strong>Ce que vous pouvez faire :</strong> Mettez en place rapidement la structure de vos bases de données, créez vos API pour faire communiquer vos services, et concevez des interfaces utilisateur (frontend) prêtes à l'emploi.
                </div>
              </div>
            )}

            {activeSection === "dbeditor" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Base de données</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cette section vous permet de structurer les informations de votre application de manière visuelle, un peu comme un tableau géant où vous organisez vos données.
                </p>
                <ul className="list-disc list-inside text-xs md:text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                  <li>Créez facilement vos listes d'éléments et définissez les informations associées (par exemple, les profils utilisateurs ou les produits).</li>
                  <li>Reliez les informations entre elles en quelques clics sans compétences techniques requises.</li>
                </ul>
              </div>
            )}

            {activeSection === "api" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Éditeur d'API</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  L'éditeur d'API sert à définir les "passerelles" ou les règles de communication de votre application. C'est ce qui permet à votre interface d'enregistrer, de modifier ou de récupérer des informations depuis la base de données.
                </p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Vous y assemblez des blocs logiques de façon visuelle pour décider de ce qui se passe lorsqu'un utilisateur effectue une action.
                </p>
              </div>
            )}

            {activeSection === "pages" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Pages web</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  L'outil de création de pages web vous offre la liberté de concevoir le design de votre site ou de votre application directement à l'écran.
                </p>
                <ul className="list-disc list-inside text-xs md:text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                  <li>Ajoutez des boutons, des textes, des images et des formulaires par simple glisser-déposer.</li>
                  <li>Organisez la structure de votre page et adaptez l'affichage pour qu'il soit beau aussi bien sur ordinateur que sur téléphone.</li>
                </ul>
              </div>
            )}

            {activeSection === "export" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Exportation</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Une fois que votre application est prête et configurée selon vos envies, la fonction d'exportation rassemble tout votre travail.
                </p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Elle génère proprement l'ensemble des fichiers nécessaires pour que vous puissiez récupérer, installer et exécuter votre projet complet de manière autonome.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}