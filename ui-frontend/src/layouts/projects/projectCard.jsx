import { Folder, LayoutGrid, Plus } from "lucide-react";

export default function ProjectCard({index, name, handleProjectSelection}) {
    return <>
        <div
            key={index}
            onClick={() => handleProjectSelection(name)}
            className="group bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:border-couleur1/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-couleur1/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

            <div className="w-14 h-14 rounded-xl bg-couleur3 flex items-center justify-center text-couleur1 mb-6 group-hover:bg-couleur1 group-hover:text-white transition-all duration-300 shadow-inner">
                <Folder size={28} />
            </div>

            <h3 className="text-xl font-bold text-couleur1 truncate mb-2">{name}</h3>
            <p className="text-sm text-couleur1/50 line-clamp-2 mb-6">Open workspace to configure API endpoints and database schema.</p>

            <div className="mt-auto pt-4 border-t border-couleur1/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-couleur1 opacity-40 text-[10px] font-bold uppercase tracking-wider">
                    <LayoutGrid size={12} /> Workspace
                </div>
                <div className="text-couleur1 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs flex items-center gap-1">
                    Manage <Plus size={14} className="rotate-45" />
                </div>
            </div>
        </div>
    </>
}