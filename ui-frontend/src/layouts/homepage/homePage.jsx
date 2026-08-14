// Utilisation de Lucide pour les icônes
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ProjectCard } from "../../components/projectCard";
import SideMenu from "../../components/sideMenu";
import LayoutHeader from "../../components/layoutHeader";
import { GoApp } from "../../services/bridge";
import ProjectPageView from "../projects/projectPageContent";
import { setActualProject } from "../../appSlice";
import { X, FileText, Layout, LucidePuzzle, Globe, MessageCircle, Command, Logs, Play, StopCircle, RefreshCcw } from "lucide-react";
import AiChatModal from "../../components/modalAI";

const HomePage = () => {
    const actualProject = useSelector((state) => state.app.actualProject);
    const dispatch = useDispatch();
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentProjects, setRecentProjects] = useState([]);
    const [isChatModalOpen, setChatModalOpen] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            if (actualProject) {
                setLoading(true);
                try {
                    const res = await GoApp.fetchProjectByName(actualProject);

                    console.log("res", res);
                    if (res.nom != "") {
                        setProjectDetails(res);

                    }
                    else {
                        dispatch(setActualProject(''))
                    }


                } catch (err) {
                    console.error("Error loading project details:", err);
                }
                setLoading(false);
            } else {
                try {
                    const projects = await GoApp.fetchProjects();
                    if (projects) {
                        setRecentProjects(projects.slice(0, 5));
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
        window.location.reload()
    };

    const [logs, setLogs] = useState({
        isRunning: false,
        logs: [],
        pid: 0,
    })
    const handleStart = async () => {
        console.log(projectDetails.nom)
        const res = await GoApp.runProject(projectDetails.nom)

        setLogs(res)
    }
    useEffect(() => {
        // Handler pour intercepter les données envoyées par Go
        const handleGoMessage = (event) => {
            console.log("Données reçues de Go :", event);
            setLogs(event.detail);
        };

        // Attacher l'écouteur d'événement
        window.addEventListener('get-status-event', handleGoMessage);

        // Nettoyer l'écouteur au démontage du composant
        return () => {
            window.removeEventListener('get-status-event', handleGoMessage);
        };
    }, []);
    return (
        <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
            <SideMenu />

            {/* Bouton Floating Action Chat */}
            <button
                className="fixed bottom-6 right-6 z-50 bg-couleur1 text-couleur3 p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
                onClick={() => setChatModalOpen(true)}
            >
                <MessageCircle size={22} />
            </button>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-couleur1/10 dark:border-white/5">
                    <LayoutHeader layoutName={actualProject ? `Project Dashboard` : "Global Dashboard"} />
                    {actualProject && (
                        <button
                            onClick={handleCloseProject}
                            title="Close project view"
                            className="p-2.5 hover:bg-couleur1 hover:text-white rounded-xl transition-all duration-200 text-couleur1 border border-couleur1/20 dark:border-white/20 dark:text-gray-300 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {actualProject ? (
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-couleur1 dark:text-gray-400 animate-pulse font-semibold">
                            <span>Fetching project details...</span>
                        </div>
                    ) : (
                        projectDetails && (
                            <div className="space-y-8 flex flex-col">
                                <AiChatModal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(!isChatModalOpen)} />

                                {projectDetails.type === "web_app" && (
                                    <div className="flex items-center gap-3.5 mb-2 text-couleur1 dark:text-gray-200">
                                        <div className="p-2.5 bg-couleur1 text-white rounded-xl shadow-md">
                                            <Layout size={22} />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{projectDetails.nom} Workspace</h2>
                                    </div>
                                )}

                                <ProjectPageView project={projectDetails} />

                                {projectDetails.type !== "bdd" && (
                                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex w-full flex-col gap-4">

                                            {/* Command Bar Floating */}
                                            <div className="fixed bg-couleur1 dark:bg-gray-900/90 backdrop-blur-md p-1.5 px-3 gap-3 bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full border border-couleur1/10 dark:border-white/10 shadow-xl flex items-center w-12 hover:w-80 transition-all duration-500 ease-in-out group overflow-hidden">
                                                <h3 className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2 text-couleur3 whitespace-nowrap min-w-max">
                                                    <Command size={18} /> Commands
                                                </h3>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    {!logs.isRunning && (
                                                        <button
                                                            onClick={() => handleStart()}
                                                            className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                                                            title="Start"
                                                        >
                                                            <Play size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                                                        onClick={async () => {
                                                            const res = await GoApp.stopProject(projectDetails.nom)
                                                            setLogs(res)
                                                        }}
                                                        title="Stop"
                                                    >
                                                        <StopCircle size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                                                        onClick={async () => {
                                                            await GoApp.stopProject(projectDetails.nom)
                                                            await handleStart()
                                                        }}
                                                        title="Restart"
                                                    >
                                                        <RefreshCcw size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Terminal / Logs Card */}
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <Logs size={18} /> Logs
                                                </h3>
                                                <div className="flex flex-col gap-2">
                                                    <div className="bg-gray-950 text-emerald-400 font-mono text-xs min-h-44 max-h-56 p-4 rounded-xl flex flex-col overflow-y-auto shadow-inner space-y-1 border border-gray-800">
                                                        {logs.logs && logs.logs.length > 0 ? (
                                                            logs.logs.map((log, index) => (
                                                                <code key={index} className="leading-relaxed opacity-90">{log}</code>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-600 italic">No logs available...</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Web App Overview Section */}
                                {projectDetails.type === "web_app" && (
                                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <FileText size={18} /> Recent Pages
                                                </h3>
                                                <div className="space-y-2.5">
                                                    {projectDetails.web_app?.pages?.length > 0 ? (
                                                        projectDetails.web_app.pages.slice(0, 3).map((page, i) => (
                                                            <div key={i} className="flex justify-between items-center p-3 bg-couleur3/30 dark:bg-gray-800/60 rounded-xl text-sm border border-couleur1/5 dark:border-white/5 hover:bg-couleur3/50 transition-colors">
                                                                <span className="font-semibold text-couleur1 dark:text-gray-200">{page.nom}</span>
                                                                <span className="text-xs opacity-60 font-mono px-2 py-0.5 rounded bg-couleur1/5 dark:bg-gray-900 text-couleur1 dark:text-gray-400">{page.uri || '/'}</span>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic py-2">No pages created yet.</p>}
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <LucidePuzzle size={18} /> Components
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {projectDetails.web_app?.composant?.length > 0 ? (
                                                        projectDetails.web_app.composant.map((comp, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-couleur1/10 dark:bg-gray-800 text-couleur1 dark:text-gray-300 rounded-lg text-xs font-semibold border border-couleur1/20 dark:border-white/10 shadow-xs">
                                                                {comp.nom || comp}
                                                            </span>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic py-2">No components available.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Static Site Overview Section */}
                                {projectDetails.type === "static" && (
                                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-3.5 mb-6 text-couleur1 dark:text-gray-200">
                                            <div className="p-2.5 bg-couleur1 text-white rounded-xl shadow-md">
                                                <Globe size={22} />
                                            </div>
                                            <h2 className="text-2xl font-bold">Static Site Workspace</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <FileText size={18} /> Content Pages
                                                </h3>
                                                <div className="space-y-2.5">
                                                    {projectDetails.site_statique?.pages?.length > 0 ? (
                                                        projectDetails.site_statique.pages.slice(0, 3).map((page, i) => (
                                                            <div key={i} className="flex justify-between items-center p-3 bg-couleur3/30 dark:bg-gray-800/60 rounded-xl text-sm border border-couleur1/5 dark:border-white/5 hover:bg-couleur3/50 transition-colors">
                                                                <span className="font-semibold text-couleur1 dark:text-gray-200">{page.nom}</span>
                                                                <span className="text-xs opacity-60 font-mono px-2 py-0.5 rounded bg-couleur1/5 dark:bg-gray-900 text-couleur1 dark:text-gray-400">{page.uri || `/${page.nom.toLowerCase()}`}</span>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic py-2">No pages created yet.</p>}
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <LucidePuzzle size={18} /> UI Components
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {projectDetails.site_statique?.composants?.length > 0 ? (
                                                        projectDetails.site_statique.composants.map((comp, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-couleur1/10 dark:bg-gray-800 text-couleur1 dark:text-gray-300 rounded-lg text-xs font-semibold border border-couleur1/20 dark:border-white/10 shadow-xs">
                                                                {comp.nom || comp}
                                                            </span>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic py-2">No components available.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        )
                    )
                ) : (
                    <section className="mb-10">
                        <h2 className="text-lg font-semibold mb-5 opacity-70 text-couleur6 dark:text-gray-400 tracking-wide uppercase text-xs">Recent Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentProjects.length > 0 ? (
                                recentProjects.map((projectName, index) => (
                                    <div
                                        key={index}
                                        onClick={() => dispatch(setActualProject(projectName.nom))}
                                        className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-200"
                                    >
                                        <ProjectCard name={projectName.nom} type={projectName.type} updateAt={projectName.update_at} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-couleur1 dark:text-gray-400 opacity-60 italic py-8 text-center bg-white/40 dark:bg-gray-900/40 rounded-2xl border border-dashed border-couleur1/20 dark:border-white/10">
                                    No projects available.
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};


export default HomePage;
