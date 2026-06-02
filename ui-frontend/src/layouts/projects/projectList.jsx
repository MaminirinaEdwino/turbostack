import { Folder, Plus, Search, LayoutGrid } from "lucide-react";
import SideMenu from "../../components/sideMenu";
import { GoApp } from "../../services/bridge";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActualProject, setActualWindow } from "../../appSlice";
import ProjectListHeader from "./projectListHeader";
import ProjectCard from "./projectCard";

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
        dispatch(setActualWindow('Dashboard'));
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
                    
                    <ProjectListHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} dispatch={dispatch} setActualWindow={setActualWindow}></ProjectListHeader>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map((name, index) => (
                        <ProjectCard index={index} name={name} handleProjectSelection={handleProjectSelection}></ProjectCard>
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