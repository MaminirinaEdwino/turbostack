import { Plus, Search } from "lucide-react";

export default function ProjectListHeader({searchTerm, setSearchTerm, dispatch, setActualWindow}) {
    return <>
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-couleur1 opacity-40 group-focus-within:opacity-100 transition-opacity" size={20} />
                <input
                    type="text"
                    placeholder="Filter projects..."
                    className="pl-10 pr-4 py-2.5 border border-couleur1/20 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-couleur1/20 text-couleur1 dark:text-gray-100 w-64 shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
                onClick={() => dispatch(setActualWindow('New Project'))}
                className="flex items-center gap-2 bg-couleur1 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:bg-opacity-90 transition-all font-bold"
            >
                <Plus size={20} /> New Project
            </button>
        </div>
    </>
}