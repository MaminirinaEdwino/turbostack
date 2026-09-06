import { Edit3, FileText, Plus, Puzzle, Trash2 } from "lucide-react";

export default function PageList({addPage, siteData, project, setSelectedComponentIndex, setEditingType, setSelectedPageIndex, setEditMode, removePage, addComponent, compKey, removeComponent}) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Liste des Pages */}
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-couleur1 dark:text-gray-200">
                    <FileText size={18} /> Pages
                </h2>
                <button
                    onClick={addPage}
                    className="p-2 bg-couleur1 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                >
                    <Plus size={18} /> Add Page
                </button>
            </div>
            {siteData?.pages?.map((page, index) => (
                <div
                    key={page.id || index}
                    className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 flex justify-between items-center group hover:border-couleur1 transition-all"
                >
                    <div>
                        <p className="font-bold text-couleur1">{page.nom}</p>
                        {project?.type != "web_app" && <p className="text-xs opacity-50">{page.uri}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedPageIndex(index);
                                setEditingType("page");
                                setEditMode(true);
                            }}
                            className="p-2 bg-couleur1/5 text-couleur1 rounded-lg hover:bg-couleur1 hover:text-white transition-all"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => removePage(index)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </section>

        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-couleur1 dark:text-gray-200 flex items-center gap-2">
                    <Puzzle size={18} /> Components
                </h2>
                <button
                    onClick={addComponent}
                    className="p-2 bg-couleur1 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                >
                    <Plus size={18} /> Add Component
                </button>
            </div>
            <div className="space-y-3">
                {siteData?.[compKey]?.map((comp, index) => (
                    <div
                        key={comp.id || index}
                        className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 flex justify-between items-center group hover:border-couleur1 transition-all"
                    >
                        <div>
                            <p className="font-bold text-couleur1">{comp.nom}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedComponentIndex(index);
                                    setEditingType("component");
                                    setEditMode(true);
                                }}
                                className="p-2 bg-couleur1/5 text-couleur1 rounded-lg hover:bg-couleur1 hover:text-white transition-all"
                            >

                                <Edit3 size={18} />
                            </button>
                            <button
                                onClick={() => removeComponent(index)}
                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {(!siteData?.[compKey] || siteData[compKey].length === 0) && (
                    <div className="h-32 border-2 border-dashed border-couleur1/10 rounded-3xl flex items-center justify-center text-couleur1/30 italic text-sm">
                        No components created yet.
                    </div>
                )}
            </div>
        </section>
    </div>
}