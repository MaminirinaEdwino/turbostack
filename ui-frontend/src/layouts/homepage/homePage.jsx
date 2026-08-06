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
                    setProjectDetails(res);
                    // console.log("res",JSON.stringify(res))
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
        <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300" >
            <SideMenu />
            <button className="fixed bottom-20 right-2 z-50 bg-couleur1 text-couleur3 p-3 rounded-lg" onClick={() => setChatModalOpen(true)}><MessageCircle size={20} /></button>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <LayoutHeader layoutName={actualProject ? `Project Dashboard` : "Global Dashboard"} />
                    {actualProject && (
                        <button
                            onClick={handleCloseProject}
                            title="Close project view"
                            className="p-2 hover:bg-couleur1 hover:text-white rounded transition-colors text-couleur1 border border-couleur1 dark:border-white/20 dark:text-gray-300"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {actualProject ? (
                    loading ? (
                        <div className="text-couleur1 dark:text-gray-400 py-10 text-center animate-pulse font-semibold">Fetching project details...</div>
                    ) : (
                        projectDetails && (
                            <div className="space-y-8 flex flex-col">
                                <AiChatModal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(!isChatModalOpen)} />
                                {projectDetails.type == "web_app" && <div className="flex items-center gap-3 mb-4 text-couleur1 dark:text-gray-200">
                                    <div className="p-2 bg-couleur1 text-white rounded-lg shadow-sm">
                                        <Layout size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold">{projectDetails.nom} Workspace</h2>
                                </div>}

                                <ProjectPageView project={projectDetails} />
                                {projectDetails.type != "bdd" && <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                            <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                <Command size={18} /> Commands
                                            </h3>
                                            <div className=" flex gap-2">
                                                {
                                                    !logs.isRunning && <button onClick={() => handleStart()} className="px-3 py-1 rounded-md bg-green-500 text-couleur3 flex gap-2 items-center cursor-pointer"><Play size={15} /> Start</button>
                                                }
                                                <button className="px-3 py-1 rounded-md bg-red-500 text-couleur3 flex gap-2 items-center cursor-pointer" onClick={async () => {
                                                    const res = await GoApp.stopProject(projectDetails.nom)
                                                    setLogs(res)
                                                }}> <StopCircle /> Stop</button>
                                                <button className="px-3 py-1 rounded-md bg-yellow-500 text-couleur3 flex gap-2 items-center cursor-pointer" onClick={async () => {
                                                    await GoApp.stopProject(projectDetails.nom)
                                                    await handleStart()
                                                }}> <RefreshCcw size={15} /> Restart</button>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                            <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                <Logs size={18} /> Logs
                                            </h3>
                                            <div className="flex flex-wrap flex-col gap-2 ">
                                                {logs?.isRunning ? "Running" : "Stop"}
                                                {/* {logs?.isRunning && "PID "+logs.pid} */}
                                                <div className="bg-gray-950 text-white text-xs min-h-20 max-h-20 p-2 rounded-md flex flex-col overflow-scroll">
                                                    {logs.logs && logs.logs.map(log => <code>{log}</code>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>}
                                {/* Web App Overview Section */}
                                {projectDetails.type === "web_app" && (
                                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <FileText size={18} /> Recent Pages
                                                </h3>
                                                <div className="space-y-2">
                                                    {projectDetails.web_app?.pages?.length > 0 ? (
                                                        projectDetails.web_app.pages.slice(0, 3).map((page, i) => (
                                                            <div key={i} className="flex justify-between items-center p-3 bg-couleur3/30 dark:bg-gray-800 rounded-xl text-sm border border-couleur1/5 dark:border-white/5">
                                                                <span className="font-medium text-couleur1 dark:text-gray-300">{page.nom}</span>
                                                                <span className="text-xs opacity-50 font-mono text-couleur1 dark:text-gray-400">{page.uri || '/'}</span>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic">No pages created yet.</p>}
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <LucidePuzzle size={18} /> Components
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {projectDetails.web_app?.composant?.length > 0 ? (
                                                        projectDetails.web_app.composant.map((comp, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-couleur1/10 dark:bg-gray-800 text-couleur1 dark:text-gray-300 rounded-lg text-xs font-semibold border border-couleur1/20 dark:border-white/10">
                                                                {comp.nom || comp}
                                                            </span>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic">No components available.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Static Site Overview Section */}
                                {projectDetails.type === "static" && (
                                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-3 mb-4 text-couleur1 dark:text-gray-200">
                                            <div className="p-2 bg-couleur1 text-white rounded-lg shadow-sm">
                                                <Globe size={20} />
                                            </div>
                                            <h2 className="text-2xl font-bold">Static Site Workspace</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <FileText size={18} /> Content Pages
                                                </h3>
                                                <div className="space-y-2">
                                                    {projectDetails.site_statique?.pages?.length > 0 ? (
                                                        projectDetails.site_statique.pages.slice(0, 3).map((page, i) => (
                                                            <div key={i} className="flex justify-between items-center p-3 bg-couleur3/30 dark:bg-gray-800 rounded-xl text-sm border border-couleur1/5 dark:border-white/5">
                                                                <span className="font-medium text-couleur1 dark:text-gray-300">{page.nom}</span>
                                                                <span className="text-xs opacity-50 font-mono text-couleur1 dark:text-gray-400">{page.uri || `/${page.nom.toLowerCase()}`}</span>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic">No pages created yet.</p>}
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm">
                                                <h3 className="text-lg font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <LucidePuzzle size={18} /> UI Components
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {projectDetails.site_statique?.composants?.length > 0 ? (
                                                        projectDetails.site_statique.composants.map((comp, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-couleur1/10 dark:bg-gray-800 text-couleur1 dark:text-gray-300 rounded-lg text-xs font-semibold border border-couleur1/20 dark:border-white/10">
                                                                {comp.nom || comp}
                                                            </span>
                                                        ))
                                                    ) : <p className="text-sm text-gray-400 italic">No components available.</p>}
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
                        <h2 className="text-xl mb-4 opacity-60 text-couleur6 dark:text-gray-400" >Recent Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentProjects.length > 0 ? (
                                recentProjects.map((projectName, index) => (
                                    <div key={index} onClick={() => dispatch(setActualProject(projectName.nom))} className="cursor-pointer">
                                        <ProjectCard name={projectName.nom} type={projectName.type} updateAt={projectName.update_at} />
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
