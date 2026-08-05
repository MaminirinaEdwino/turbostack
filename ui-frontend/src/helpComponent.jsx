import React, { useState } from "react";

export default function HelpDocumentation({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState("overview");

  if (!isOpen) return null;

  const sections = [
    { id: "overview", icon: "⚡", title: "Introduction TurboStack" },
    { id: "dbeditor", icon: "📊", title: "DBEditor & Query Builder" },
    { id: "controllers", icon: "⚙️", title: "Génération de Contrôleurs" },
    { id: "ai", icon: "🤖", title: "Moteur IA & Inférence" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 transition-all">
      {/* Conteneur principal */}
      <div className="flex w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Barre Latérale (Menu) */}
        <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 text-lg">📖</span> 
              Documentation
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeSection === sec.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span>{sec.icon}</span>
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Zone de Contenu */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative">
          
          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
          >
            ✕
          </button>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Contenu dynamique selon la section */}
            {activeSection === "overview" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Introduction à TurboStack</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  TurboStack est un moteur Go-natif de scripting visuel et de génération de projets sans dépendances tierces. Il permet de générer des APIs REST, des architectures frontend statiques et des modèles de bases de données via une interface graphique.
                </p>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-sm text-indigo-800 dark:text-indigo-300">
                  <strong>Architecture Pure Go :</strong> Utilise `http.ServeMux` pour le routage et `lib/pq` pour PostgreSQL.
                </div>
              </div>
            )}

            {activeSection === "dbeditor" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">DBEditor & Query Builder</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Interface permettant de modéliser visuellement les tables de votre base de données et de construire des requêtes SQL complexes.
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                  <li>Support natif de <strong>PostgreSQL</strong>.</li>
                  <li>Génération visuelle des clauses <code>JOIN</code>, <code>WHERE</code>, et <code>ORDER BY</code>.</li>
                  <li>Exportation directe du code SQL généré.</li>
                </ul>
              </div>
            )}

            {activeSection === "controllers" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Génération de Contrôleurs</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  TurboStack exporte automatiquement les contrôleurs en code source Go (syntaxe 1.22+).
                </p>
                <pre className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto">
{`mux.HandleFunc("POST /api/users", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    // Logique générée par TurboStack
})`}
                </pre>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Gère nativement les requêtes <code>application/json</code> et <code>multipart/form-data</code>.
                </p>
              </div>
            )}

            {activeSection === "ai" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Moteur IA & Inférence</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  TurboStack intègre un réseau de neurones personnalisé (MLP) capable de :
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                  <li>Déduire l'architecture optimale (API pure vs Full-stack).</li>
                  <li>Extraire les entités depuis des descriptions textuelles.</li>
                  <li>Corriger automatiquement les artefacts (ex: "null byte" buffers).</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}