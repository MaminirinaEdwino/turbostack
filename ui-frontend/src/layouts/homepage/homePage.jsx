// Utilisation de Lucide pour les icônes
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ProjectCard } from "../../components/projectCard";
import SideMenu from "../../components/sideMenu";
import LayoutHeader from "../../components/layoutHeader";
import { GoApp } from "../../services/bridge";
import ProjectPageView from "../projects/projectPageContent";
import { setActualProject } from "../../appSlice";
import { X } from "lucide-react";

const HomePage = () => {
    const actualProject = useSelector((state) => state.app.actualProject);
    const dispatch = useDispatch();
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (actualProject) {
                setLoading(true);
                try {
                    const res = await GoApp.fetchProjectByName(actualProject);
                    setProjectDetails(res);
                } catch (err) {
                    console.error("Error loading project details:", err);
                }
                setLoading(false);
            } else {
                try {
                    const projects = await GoApp.fetchProjects();
                    if (projects) {
                        setRecentProjects(projects.slice(-4).reverse());
                    }
                } catch (err) {
                    console.error("Error loading projects list:", err);
                }
            }
        };
        loadData();
    }, [actualProject]);

    const handleCloseProject = () => {
        dispatch(setActualProject(''));
    };

    return (
        <div className="flex h-screen w-full font-san bg-couleur3" >
            <SideMenu />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <LayoutHeader layoutName={actualProject ? `Project Dashboard` : "Global Dashboard"}/>
                    {actualProject && (
                        <button 
                            onClick={handleCloseProject} 
                            title="Close project view" 
                            className="p-2 hover:bg-couleur1 hover:text-white rounded transition-colors text-couleur1 border border-couleur1"
                        >
                            <X size={20} /> 
                        </button>
                    )}
                </div>
                
                {actualProject ? (
                    loading ? (
                        <div className="text-couleur1 py-10 text-center animate-pulse font-semibold">Fetching project details...</div>
                    ) : (
                        projectDetails && <ProjectPageView project={projectDetails} />
                    )
                ) : (
                    <section className="mb-10">
                        <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Recent Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentProjects.length > 0 ? (
                                recentProjects.map((projectName, index) => (
                                    <div key={index} onClick={() => dispatch(setActualProject(projectName))} className="cursor-pointer">
                                        <ProjectCard name={projectName} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-couleur1 opacity-50 italic py-4">No projects available.</div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};


export default HomePage;
