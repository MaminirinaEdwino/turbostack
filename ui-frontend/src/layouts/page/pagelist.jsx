import { useEffect, useState } from "react";
import { useNavigate } from "../../hooks/useNavigate";
import { GoApp } from "../../services/bridge";
import SideMenu from "../../components/sideMenu";
import { useSelector } from "react-redux";
import { FileText, Puzzle, Layout, List, ChevronLeft, ChevronRight, Settings, ExternalLink } from "lucide-react";

export default function Pageslist() {
    const navigateTo = useNavigate();
    const projectName = useSelector((state) => state.app.actualProject);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const loadProject = async () => {
            if (!projectName) {
                setError("No project selected. Please go to the Dashboard and select a project.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await GoApp.fetchProjectByName(projectName);
                if (res) {
                    setProject(res);
                    setError(null);
                } else {
                    setError(`Project '${projectName}' not found.`);
                }
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError("Failed to load project data.");
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [projectName]);

    // Détermination des données selon le type de projet (statique ou webapp)
    const isStatic = project?.type === "static";
    const isWebApp = project?.type === "webapp";
    const siteData = isStatic ? project?.site_statique : (isWebApp ? project?.web_app : null);
    
    const pages = siteData?.pages || [];
    const components = siteData?.composants || siteData?.composant || [];
    
    const totalPages = pages.length;
    const totalComponents = components.length;
    
    const totalPaginationPages = Math.ceil(totalPages / itemsPerPage);

    const currentPages = pages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
                <SideMenu />
                <div className="flex-1 flex items-center justify-center text-couleur1 dark:text-gray-100 text-xl">
                    Loading details for {projectName || "selected project"}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
                <SideMenu />
                <div className="flex-1 flex flex-col items-center justify-center text-red-500 text-xl p-8">
                    <p>{error}</p>
                    {!projectName && (
                        <button onClick={() => navigateTo("Project")} className="mt-4 px-4 py-2 bg-couleur1 text-white rounded-lg hover:bg-opacity-90">
                            Go to Project List
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full font-san bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
            <SideMenu />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-couleur1 dark:text-gray-100 text-3xl font-semibold mb-6 flex items-center gap-3">
                    <Layout size={32} /> {isStatic ? 'Static Site' : 'Web App'} Details for {projectName}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-couleur1/10 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText size={24} className="text-couleur1 dark:text-gray-200" />
                            <h2 className="text-xl font-bold text-couleur1 dark:text-gray-200">Site Summary</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">Total Pages: <span className="font-semibold">{totalPages}</span></p>
                        <p className="text-gray-700 dark:text-gray-300">Total Components: <span className="font-semibold">{totalComponents}</span></p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-couleur1/10 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <Puzzle size={24} className="text-couleur1 dark:text-gray-200" />
                            <h2 className="text-xl font-bold text-couleur1 dark:text-gray-200">Available Components</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                            {components.length > 0 ? components.map((comp, i) => (
                                <span key={i} className="px-3 py-1 bg-couleur3 dark:bg-gray-800 text-couleur1 dark:text-gray-300 rounded-full text-sm">
                                    {comp.nom || comp}
                                </span>
                            )) : <span className="text-gray-500 italic text-sm">No components defined</span>}
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-couleur1 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <List size={24} /> Pages List
                </h2>
                {totalPages === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 italic">No pages defined yet.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentPages.map((page, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-couleur1/10 dark:border-white/5 group hover:border-couleur1/40 transition-all">
                                    <div className="flex items-center justify-between mb-3 border-b border-couleur1/10 dark:border-white/5 pb-2">
                                        <div className="flex items-center gap-2">
                                            <FileText size={18} className="text-couleur1 dark:text-gray-200" />
                                            <span className="text-lg font-semibold text-couleur1 dark:text-gray-200">{page.nom}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-1.5 rounded truncate">
                                        Path: {page.uri || `/${page.nom?.toLowerCase()}`}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {totalPaginationPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="p-2 rounded-lg border border-couleur1 dark:border-white/20 text-couleur1 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-couleur1 dark:text-gray-200 font-medium">Page {currentPage} of {totalPaginationPages}</span>
                                <button 
                                    disabled={currentPage === totalPaginationPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPaginationPages, prev + 1))}
                                    className="p-2 rounded-lg border border-couleur1 dark:border-white/20 text-couleur1 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}