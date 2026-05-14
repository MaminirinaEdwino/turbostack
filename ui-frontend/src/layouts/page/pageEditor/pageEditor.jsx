import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "../../../hooks/useNavigate";
import { GoApp } from "../../../services/bridge";
import {
    Plus, Save, Layout, FileText, Puzzle, Trash2,
    CheckCircle, Loader2, AlertCircle, Globe, X
} from "lucide-react";
import { FcPrevious } from "react-icons/fc";

export default function PageEditor({ projectName }) {
    const navigateTo = useNavigate();
    const isDarkMode = useSelector((state) => state.app.darkMode);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            try {
                const res = await GoApp.fetchProjectByName(projectName);
                if (res) setProject(res);
            } catch (error) {
                showToast("Error loading project", error);
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [projectName]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleSave = async () => {
        showToast("Saving changes...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("Project saved successfully!");
        } catch (error) {
            showToast("Error saving project", isDarkMode, error);
        }
    };

    const updateSiteData = (key, value) => {
        const updated = { ...project };
        if (project.type === "static") updated.site_statique[key] = value;
        else if (project.type === "webapp") updated.web_app[key] = value;
        setProject(updated);
    };

    const addPage = () => {
        const siteData = project.type === "static" ? project.site_statique : project.web_app;
        const pages = [...(siteData.pages || []), { nom: "New Page", uri: "/new-page" }];
        updateSiteData("pages", pages);
    };

    const removePage = (index) => {
        const siteData = project.type === "static" ? project.site_statique : project.web_app;
        const pages = siteData.pages.filter((_, i) => i !== index);
        updateSiteData("pages", pages);
    };

    if (loading) return (
        <div className="flex h-screen w-screen items-center justify-center bg-couleur3 dark:bg-gray-950">
            <Loader2 className="animate-spin text-couleur1" size={48} />
        </div>
    );

    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-couleur1/10 dark:border-white/5">
                <h1 className="text-couleur1 dark:text-gray-100 text-2xl font-bold flex items-center gap-3">
                    <button
                        className="p-2 rounded-lg border border-couleur1 dark:border-white/20 bg-white dark:bg-gray-800 hover:bg-couleur3 dark:hover:bg-gray-700 transition-all"
                        onClick={() => navigateTo("Dashboard")}
                    >
                        <FcPrevious size={20} />
                    </button>
                    Page Editor : {projectName}
                </h1>
                <div className="flex gap-3">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-couleur1 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Pages Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-couleur1 dark:text-gray-200 flex items-center gap-2">
                            <FileText /> Project Pages
                        </h2>
                        <button onClick={addPage} className="p-2 bg-couleur1/10 text-couleur1 dark:text-gray-200 rounded-lg hover:bg-couleur1 hover:text-white transition-all">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {siteData?.pages?.map((page, index) => (
                            <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold opacity-50 uppercase">Page Name</label>
                                            <input
                                                className="bg-transparent border-b border-transparent focus:border-couleur1 dark:text-gray-200 outline-none font-semibold text-lg w-full"
                                                value={page.nom}
                                                onChange={(e) => {
                                                    const newPages = [...siteData.pages];
                                                    newPages[index].nom = e.target.value;
                                                    updateSiteData("pages", newPages);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold opacity-50 uppercase">URI Path</label>
                                            <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                                                <Globe size={14} />
                                                <input
                                                    className="bg-transparent border-b border-transparent focus:border-couleur1 dark:text-gray-400 outline-none w-full"
                                                    value={page.uri}
                                                    onChange={(e) => {
                                                        const newPages = [...siteData.pages];
                                                        newPages[index].uri = e.target.value;
                                                        updateSiteData("pages", newPages);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removePage(index)}
                                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Components Section Placeholder (Future usage) */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-couleur1 dark:text-gray-200 flex items-center gap-2">
                        <Puzzle /> UI Components
                    </h2>
                    <div className="border-2 border-dashed border-couleur1/20 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                        <Puzzle size={48} className="text-couleur1/20 mb-4" />
                        <p className="text-couleur1/60 font-medium">Visual Component Editor</p>
                        <p className="text-sm text-gray-500">Coming soon: Drag & Drop components to build your pages.</p>
                    </div>
                </section>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${toast.type === "error" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" :
                        toast.type === "loading" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" :
                            "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                    }`}>
                    {toast.type === "loading" ? <Loader2 size={18} className="animate-spin" /> :
                        toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
}