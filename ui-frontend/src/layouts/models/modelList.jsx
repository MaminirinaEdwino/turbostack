import { useEffect, useState } from "react";
import { useNavigate } from "../../hooks/useNavigate";
import { GoApp } from "../../services/bridge";
import SideMenu from "../../components/sideMenu";
import { useSelector } from "react-redux";
import { Database, Table, List, ChevronLeft, ChevronRight, Settings } from "lucide-react";

export default function BDDModelList() {
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

    const models = project?.bdd?.models || [];
    const totalModels = models.length;
    const totalFields = models.reduce((acc, m) => acc + (m.champs?.length || 0), 0);
    const totalPages = Math.ceil(totalModels / itemsPerPage);

    const currentModels = models.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex h-screen w-full font-san bg-couleur3">
                <SideMenu />
                <div className="flex-1 flex items-center justify-center text-couleur1 text-xl">
                    Loading database details for {projectName || "selected project"}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full font-san bg-couleur3">
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

    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu />
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-couleur1 text-3xl font-semibold mb-6 flex items-center gap-3">
                <Database size={32} /> Database Models for {projectName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-couleur1/10">
                    <div className="flex items-center gap-3 mb-3">
                        <Table size={24} className="text-couleur1" />
                        <h2 className="text-xl font-bold text-couleur1">Models Summary</h2>
                    </div>
                    <p className="text-gray-700">Total Tables: <span className="font-semibold">{totalModels}</span></p>
                    <p className="text-gray-700">Total Fields: <span className="font-semibold">{totalFields}</span></p>
                    <button
                        onClick={() => navigateTo("db_editor")}
                        className="mt-4 px-4 py-2 bg-couleur1 text-white rounded-lg hover:bg-opacity-90 text-sm flex items-center gap-2"
                    >
                        <Settings size={16} /> Go to DB Editor
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-couleur1 mb-4 flex items-center gap-2">
                <List size={24} /> Tables Details
            </h2>
            {totalModels === 0 ? (
                <p className="text-gray-600 italic">No tables defined yet. Use the DB Editor to add some.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentModels.map((model, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-couleur1/10">
                                <div className="flex items-center gap-2 mb-3 border-b border-couleur1/10 pb-2">
                                    <Table size={18} className="text-couleur1" />
                                    <span className="text-lg font-semibold text-couleur1">{model.nom}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Columns</p>
                                    {model.champs?.map((field, fIdx) => (
                                        <div key={fIdx} className="flex justify-between items-center bg-couleur3/20 p-1.5 rounded text-sm">
                                            <span className="font-medium text-gray-700">{field.nom}</span>
                                            <span className="text-[10px] bg-couleur1/10 text-couleur1 px-1.5 rounded uppercase font-mono">{field.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                className="p-2 rounded-lg border border-couleur1 text-couleur1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-couleur1 font-medium">Page {currentPage} of {totalPages}</span>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                className="p-2 rounded-lg border border-couleur1 text-couleur1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>;
}