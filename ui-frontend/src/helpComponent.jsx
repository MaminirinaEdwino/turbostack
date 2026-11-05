import React, { useState } from "react";

export default function HelpDocumentation({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubSection, setActiveSubSection] = useState("new-table");

  if (!isOpen) return null;

  const sections = [
    { id: "overview", title: "Introduction TurboStack" },
    { 
      id: "dbeditor", 
      title: "Base de données",
      subSections: [
        { id: "new-table", title: "Nouvelle table" },
        { id: "table-node", title: "Table node" },
        { id: "query-builder", title: "Query builder" }
      ]
    },
    { id: "api", title: "Éditeur d'API" },
    { id: "pages", title: "Pages web" },
    { id: "export", title: "Exportation" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-2 md:p-4 transition-all">
      {/* Conteneur principal */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[90vh] md:h-[85vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors z-20 cursor-pointer"
          title="Fermer"
        >
          ✕
        </button>

        {/* Barre Latérale (Menu) */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Documentation
            </h2>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 md:p-3 gap-1 scrollbar-none">
            {sections.map((sec) => (
              <div key={sec.id} className="flex flex-col">
                <button
                  onClick={() => {
                    setActiveSection(sec.id);
                    if (sec.subSections) {
                      setActiveSubSection(sec.subSections[0].id);
                    }
                  }}
                  className={`whitespace-nowrap md:whitespace-normal w-auto md:w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {sec.title}
                </button>

                {/* Sous-sections affichées si la section Base de données est active */}
                {sec.subSections && activeSection === sec.id && (
                  <div className="flex md:flex-col pl-3 md:pl-4 my-1 gap-1 border-l-2 border-indigo-200 dark:border-indigo-900 ml-2">
                    {sec.subSections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubSection(sub.id)}
                        className={`whitespace-nowrap md:whitespace-normal text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                          activeSubSection === sub.id
                            ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        - {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zone de Contenu */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar space-y-6">
            
            {activeSection === "overview" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Introduction à TurboStack</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  TurboStack est un outil simple et intuitif conçu pour vous aider à créer des applications facilement. Grâce à son interface visuelle, vous pouvez concevoir vos projets complets sans avoir à écrire de lignes de code complexes.
                </p>
                <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-xs md:text-sm text-indigo-800 dark:text-indigo-300">
                  <strong>Ce que vous pouvez faire :</strong> Mettez en place rapidement la structure de vos bases de données, créez vos API pour faire communiquer vos services, et concevez des interfaces utilisateur (frontend) prêtes à l'emploi.
                </div>
                
                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Vue d'ensemble TurboStack ]</span>
                </div>
              </div>
            )}

            {activeSection === "dbeditor" && activeSubSection === "new-table" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Base de données : Nouvelle table</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cette partie vous permet de créer de nouveaux espaces de stockage pour vos informations (par exemple, une table pour les utilisateurs ou une table pour les produits). Vous définissez simplement le nom de la table et ajoutez les champs nécessaires.
                </p>
                <ul className="list-disc list-inside text-xs md:text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li>Ajoutez des champs de texte, des nombres ou des dates en un clic.</li>
                  <li>Configurez les options principales de manière visuelle.</li>
                </ul>

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Création d'une nouvelle table ]</span>
                </div>
              </div>
            )}

            {activeSection === "dbeditor" && activeSubSection === "table-node" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Base de données : Table node</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Les "Table nodes" représentent vos tables sous forme de cartes visuelles interactives sur l'écran. Elles vous permettent de voir en un coup d'œil la structure de vos données et de relier facilement les tables entre elles pour lier vos informations.
                </p>

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Vue des Table nodes ]</span>
                </div>
              </div>
            )}

            {activeSection === "dbeditor" && activeSubSection === "query-builder" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Base de données : Query builder</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Le Query builder est l'outil qui vous aide à composer vos recherches de données de manière guidée. Il vous évite d'écrire du code de recherche complexe en assemblant des critères clairs.
                </p>
                <ul className="list-disc list-inside text-xs md:text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li>Faites des tris et des sélections ciblées.</li>
                  <li>Visualisez instantanément comment les informations sont reliées et extraites.</li>
                </ul>

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Query builder en action ]</span>
                </div>
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

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Éditeur d'API visuel ]</span>
                </div>
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

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Constructeur de pages web ]</span>
                </div>
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

                {/* Emplacement pour capture d'écran */}
                <div className="w-full h-48 md:h-64 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
                  <span>[ Emplacement pour capture d'écran : Option d'exportation ]</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}