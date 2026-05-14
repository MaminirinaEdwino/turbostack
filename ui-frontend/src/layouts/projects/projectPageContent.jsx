import BDDProjectInterface from "./components/bddPageInterface";
import ProjectResume from "./components/projectResume";
import { StatCard } from "../../components/statCard";
import { Database, Settings, FileText, LucidePuzzle } from "lucide-react";

export default function ProjectPageView({ project }) {
    // Calcul des statistiques basées sur la structure JSON
    const getStats = () => {
        let stats = [];

        // Base de données globale
        if (project.bdd?.models?.length > 0) {
            stats.push({ title: "DB Models", total: project.bdd.models.length, icon: <Database size={24} /> });
        }

        // Section API REST
        if (project.type === "api" && project.rest_api) {
            stats.push({ title: "Endpoints", total: project.rest_api.endpoints?.length || 0, icon: <Settings size={24} /> });
            if (project.rest_api.bdd?.models?.length > 0) {
                stats.push({ title: "API Models", total: project.rest_api.bdd.models.length, icon: <Database size={24} /> });
            }
        }

        // Section Web App
        if (project.type === "webapp" && project.web_app) {
            stats.push({ title: "App Pages", total: project.web_app.pages?.length || 0, icon: <FileText size={24} /> });
            stats.push({ title: "App Components", total: project.web_app.composant?.length || 0, icon: <LucidePuzzle size={24} /> });
        }

        // Section Site Statique
        if (project.type === "static" && project.site_statique) {
            stats.push({ title: "Static Pages", total: project.site_statique.pages?.length || 0, icon: <FileText size={24} /> });
            stats.push({ title: "Static Components", total: project.site_statique.composants?.length || 0, icon: <LucidePuzzle size={24} /> });
        }

        return stats;
    };

    const stats = getStats();

    return (
        <div className="m-2 flex flex-col gap-8">
            <ProjectResume nom={project.nom} type={project.type} description={project.description}></ProjectResume>

            {stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <StatCard key={i} title={stat.title} total={stat.total} icon={stat.icon} />
                    ))}
                </div>
            )}

            {project.type === "bdd" && <BDDProjectInterface project={project}></BDDProjectInterface>}
        </div>
    );
}