// Utilisation de Lucide pour les icônes
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ProjectCard } from "../../components/projectCard";
import SideMenu from "../../components/sideMenu";
import LayoutHeader from "../../components/layoutHeader";
import { GoApp } from "../../services/bridge";
import ProjectPageView from "../projects/projectPageContent";

const HomePage = () => {
    const actualProject = useSelector((state) => state.app.actualProject);
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // Charger les détails du projet si actualProject change
    useEffect(() => {
        const fetchDetails = async () => {
            if (actualProject) {
                setLoading(true);
                const res = await GoApp.fetchProjectByName(actualProject);
                setProjectDetails(res);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [actualProject]);

    return (
        <div className="flex h-screen w-full font-san bg-couleur3" >
            <SideMenu />
            <main className="flex-1 p-8 overflow-y-auto">
                <LayoutHeader layoutName={actualProject ? `Project: ${actualProject}` : "Dashboard"}/>
                
                {actualProject ? (
                    loading ? (
                        <div className="text-couleur1 py-4 animate-pulse">Loading project details...</div>
                    ) : (
                        projectDetails && <ProjectPageView project={projectDetails} />
                    )
                ) : (
                    <section className="mb-10">
                        <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Lasts projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProjectCard name="ProjectName" />
                            <ProjectCard name="ProjectName" />
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};







export default HomePage;