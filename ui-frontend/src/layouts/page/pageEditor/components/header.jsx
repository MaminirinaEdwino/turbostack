import { Save, RotateCcw, RotateCw } from "lucide-react";
import ToDashBoardBtn from "./toDashBoardbtn";

export default function Header({ editMode, setEditMode, navigateTo, editingType, project, activeItem, updateActiveItemField, projectName, handleSave, handleRedo, handleUndo, canRedo, canUndo }) {
    return <div className="p-4 px-6 flex items-center justify-between border-b border-couleur1/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20 shadow-xs transition-colors duration-300">
        <div className="flex items-center gap-4">
            <ToDashBoardBtn editMode={editMode} setEditMode={setEditMode} navigateTo={navigateTo} />
            <h1 className="text-xl font-bold text-couleur1 dark:text-gray-100 tracking-tight">
                {editMode ? (
                    <div className="flex items-start gap-2.5 flex-col w-fit">
                        <div className="flex gap-4 justify-between items-center w-full">
                            <span className="opacity-60 text-xs font-semibold uppercase tracking-wider text-couleur1 dark:text-gray-400">
                                {editingType} name : {[project?.rest_api?.endpoints?.filter(ep => ep.return_page === activeItem?.nom)].length}
                            </span>
                            {editingType == "page" && project?.type == "webapp" && project?.rest_api.endpoints.filter(ep => ep.return_page === activeItem?.nom).length > 0 && project?.rest_api.endpoints.filter(ep => ep.return_page === activeItem?.nom)[0]["nom"] != null ? <input
                                value={activeItem?.nom}
                                onChange={(e) => updateActiveItemField("nom", e.target.value)}
                                className="bg-transparent border-b border-couleur1/30 dark:border-white/20 focus:border-couleur1 dark:focus:border-white outline-none px-2 py-0.5 text-couleur1 dark:text-gray-100 text-sm font-semibold transition-colors"
                                disabled
                            /> : <input
                                value={activeItem?.nom}
                                onChange={(e) => updateActiveItemField("nom", e.target.value)}
                                className="bg-transparent border-b border-couleur1/30 dark:border-white/20 focus:border-couleur1 dark:focus:border-white outline-none px-2 py-0.5 text-couleur1 dark:text-gray-100 text-sm font-semibold transition-colors"

                            />}

                        </div>
                        {project?.type != "webapp" && (
                            <div className="flex gap-4 justify-between items-center w-full">
                                <span className="opacity-60 text-xs font-semibold uppercase tracking-wider text-couleur1 dark:text-gray-400 ">
                                    {editingType} uri :
                                </span>
                                <input
                                    value={activeItem?.uri}
                                    onChange={(e) => updateActiveItemField("uri", e.target.value)}
                                    className="bg-transparent text-sm font-mono border-b border-couleur1/30 dark:border-white/20 focus:border-couleur1 dark:focus:border-white outline-none px-2 py-0.5 text-couleur1 dark:text-gray-100 transition-colors"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="flex items-center gap-2">
                        <span className="opacity-60 font-medium text-base">Project :</span>
                        <span>{projectName}</span>
                    </span>
                )}
            </h1>
        </div>
        <div className="flex gap-3">
            <div className="flex items-center bg-couleur5 dark:bg-gray-800 border border-couleur1/20 dark:border-white/10 rounded-xl p-0.5 shadow-xs">
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    className={`p-2 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${canUndo
                            ? "text-couleur1 dark:text-gray-100 hover:bg-couleur1/10 dark:hover:bg-gray-700"
                            : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
                        }`}
                >
                    <RotateCcw size={16} />
                </button>
                <div className="w-px h-4 bg-couleur1/10 dark:bg-white/10 my-auto"></div>
                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
                    className={`p-2 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${canRedo
                            ? "text-couleur1 dark:text-gray-100 hover:bg-couleur1/10 dark:hover:bg-gray-700"
                            : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
                        }`}
                >
                    <RotateCw size={16} />
                </button>
            </div>

            {/* Section Droite : Action de Sauvegarde */}
            <button
                onClick={handleSave}
                className="bg-couleur1 hover:bg-couleur1/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
                <Save size={18} /> Save Project
            </button>
        </div>
    </div>
}