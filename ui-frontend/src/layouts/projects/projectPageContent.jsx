// import BDDProjectInterface from "./components/bddPageInterface";
import ProjectResume from "./components/projectResume";
import { StatCard } from "../../components/statCard";
import { Database, Settings, FileText, LucidePuzzle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setActualWindow } from "../../appSlice";

export default function ProjectPageView({ project }) {
    const dispatch = useDispatch();

    // Calcul des statistiques basées sur la structure JSON
    const getStats = () => {
        let stats = [];

        // Toujours afficher les modèles de la BDD racine
        stats.push({ 
            title: "DB Models", 
            total: project.bdd?.models?.length || 0, 
            icon: <Database size={24} />,
            onClick: () => dispatch(setActualWindow('db_editor')) 
        });

        // Section API REST
        if (project.type === "api") {
            stats.push({ 
                title: "Endpoints", 
                total: project.rest_api.endpoints?.length || 0, 
                icon: <Settings size={24} />,
                onClick: () => dispatch(setActualWindow('api_editor'))
            });
            // stats.push({ 
            //     title: "API Models", 
            //     total: project.rest_api.bdd?.models?.length || 0, 
            //     icon: <Database size={24} />,
            //     onClick: () => dispatch(setActualWindow('db_editor'))
            // });
        }

        // Section Web App
        if (project.type === "webapp") {
            stats.push({ title: "App Pages", total: project.web_app.pages?.length || 0, icon: <FileText size={24} /> });
            stats.push({ title: "App Components", total: project.web_app.composant?.length || 0, icon: <LucidePuzzle size={24} /> });
        }

        // Section Site Statique
        if (project.type === "static") {
            stats.push({ title: "Static Pages", total: project.site_statique.pages?.length || 0, icon: <FileText size={24} /> });
            stats.push({ title: "Static Components", total: project.site_statique.composants?.length || 0, icon: <LucidePuzzle size={24} /> });
        }
        return stats;
    };

    const stats = getStats();

    return (
        <div className="m-2 flex flex-col gap-8">
            <div className="flex flex-col gap-5">
                <div className="lg:col-span-1">
                    <ProjectResume nom={project.nom} type={project.type} />
                </div>
                <div className="lg:col-span-2 flex items-start gap-4 p-5 rounded-xl border shadow-sm border-couleur7 bg-couleur5 transition-all">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-couleur1 text-couleur1 shrink-0">
                        <FileText size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-couleur1 opacity-50 uppercase tracking-wider mb-1">Description</span>
                        <p className="text-couleur1 text-sm md:text-base leading-relaxed italic">
                            {project.description || "No description provided for this project."}
                        </p>
                    </div>
                </div>
            </div>

            {stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <StatCard key={i} title={stat.title} total={stat.total} icon={stat.icon} onClick={stat.onClick} />
                    ))}
                </div>
            )}

            {/* {project.type === "bdd" && <BDDProjectInterface project={project}></BDDProjectInterface>} */}
        </div>
    );
}