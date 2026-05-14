import { Folder, Plus, Search, LayoutGrid } from "lucide-react";
import SideMenu from "../../components/sideMenu";
import { GoApp } from "../../services/bridge";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActualProject, setActualWindow } from "../../appSlice";

export default function ProjectList() {
    const [projectList, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GoApp.fetchProjects();
                if (response != null) {
                    setProjects(response);
                } 
            } catch (err) {
                console.error("Erreur Turbo Stack:", err);
            }
        };
        loadData();
    }, []);

    const handleProjectSelection = (projectName) => {
        dispatch(setActualProject(projectName));
        dispatch(setActualWindow('Project Home Page'));
    };

    const filteredProjects = projectList.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
            <SideMenu />
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-couleur1 mb-2">Projects</h1>
                        <p className="text-couleur1 opacity-60 max-w-md">Browse and manage all your project stacks, APIs and database models.</p>
                    </div>
                    
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
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map((name, index) => (
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
                    ))}

                    {/* Empty State / Add Card */}
                    {filteredProjects.length === 0 && !searchTerm && (
                        <div 
                            onClick={() => dispatch(setActualWindow('New Project'))}
                            className="group flex flex-col items-center justify-center border-2 border-dashed border-couleur1/20 rounded-2xl p-10 cursor-pointer hover:border-couleur1/50 hover:bg-white transition-all"
                        >
                            <Plus size={40} className="text-couleur1 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all mb-4" />
                            <span className="text-sm font-bold text-couleur1 opacity-40">Create your first project</span>
                        </div>
                    )}
                </div>

                {filteredProjects.length === 0 && searchTerm && (
                    <div className="flex flex-col items-center justify-center py-24 text-couleur1 opacity-40">
                        <Search size={48} className="mb-4" />
                        <p className="text-lg italic">No projects found matching "{searchTerm}"</p>
                    </div>
                )}
            </main>
        </div>
    );
}