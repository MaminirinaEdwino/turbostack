import { useState } from "react";
import AssetUploaderModal from "./assetUploader";
import LayoutHeader from "./layoutHeader";

export default function ListView({ content, elementView, newIcon, sectionName, newText, reloadAsset }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            {/* Header de la section */}
            <LayoutHeader layoutName={sectionName} />

            {/* Zone de contenu / Liste */}
            <div className="projectSection mt-6 flex flex-wrap gap-2 md:gap-4 items-stretch">
                {content.length > 0 ? (
                    content.map((item) => elementView(item))
                ) : (
                    /* État vide (Empty State) moderne et stylisé */
                    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm my-4">
                        <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Liste vide
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Aucun élément à afficher pour le moment.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal d'upload avec arrière-plan sombre (Backdrop) et effet de flou */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
                    <AssetUploaderModal key={"asset_uploader"} reloadAsset={reloadAsset} />
                </div>
            )}

            {/* Bouton d'action flottant (FAB) repositionné et amélioré */}
            <button
                onClick={() => setShowModal(!showModal)}
                className="fixed bottom-6 right-6 z-40 text-couleur1 bg-couleur3 dark:bg-gray-950 border border-white/20 hover:border-couleur1 dark:border-couleur1 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 font-medium text-sm backdrop-blur-md"
            >
                <span className="text-lg flex items-center justify-center">{newIcon}</span>
                <span className="tracking-wide">{newText}</span>
            </button>
        </main>
    );
}