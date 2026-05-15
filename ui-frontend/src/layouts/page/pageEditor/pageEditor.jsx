import React, { useState, useEffect, useMemo } from "react";
import { GoApp } from "../../../services/bridge";
import { Save, FileText, Puzzle, Plus, Edit3, Trash2, Loader2, Type, X, PanelLeftOpen, CheckCircle, AlertCircle, PanelRightOpen } from "lucide-react";
import VisualEditor from "./visualEditor";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../../../hooks/useNavigate";

export default function PageEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedPageIndex, setSelectedPageIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast] = useState(null);

    const [activeBlock, setActiveBlock] = useState(null);
    const [rightActiveTab, setRightActiveTab] = useState("properties");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") {
            setTimeout(() => setToast(null), 3000);
        }
    };

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            const res = await GoApp.fetchProjectByName(projectName);
            if (res) setProject(res);
            setLoading(false);
        };
        loadProject();
    }, [projectName]);



    // Mise à jour générique d'un champ de la page sélectionnée
    const updatePageField = (field, value) => {
        const typeKey = project.type === "static" ? "site_statique" : "web_app";
        setProject(prev => {
            const newPages = [...prev[typeKey].pages];
            newPages[selectedPageIndex] = { ...newPages[selectedPageIndex], [field]: value };
            return {
                ...prev,
                [typeKey]: { ...prev[typeKey], pages: newPages }
            };
        });
    };

    const addPage = () => {
        const typeKey = project.type === "static" ? "site_statique" : "web_app";
        const updatedProject = { ...project };
        const newPage = {
            nom: "New Page",
            uri: "/new-page",
            content: [{
                id: Math.random().toString(36).substr(2, 9),
                tag: "div",
                content: "<h1>New Page</h1><p>Commencez à éditer...</p>",
                className: "p-8",
                styles: ""
            }]
        };
        updatedProject[typeKey].pages = [...(updatedProject[typeKey].pages || []), newPage];
        setProject(updatedProject);
    };

    const removePage = (index) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;
        const typeKey = project.type === "static" ? "site_statique" : "web_app";
        const updatedProject = { ...project };
        updatedProject[typeKey].pages = updatedProject[typeKey].pages.filter((_, i) => i !== index);
        setProject(updatedProject);
    };

    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;
    const currentPage = selectedPageIndex !== null ? siteData?.pages[selectedPageIndex] : null;

    // Convertit les blocs JSON en HTML pour la prévisualisation dans l'iframe
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const previewHtml = useMemo(() => {
        if (!currentPage?.content || !Array.isArray(currentPage.content)) return "";
        const renderBlocks = (blocks) => {
            return blocks.map(b => {
                const className = b.className || "";
                const styles = b.styles || "";
                const content = b.content || "";
                const href = b.href || "#";
                const htmlId = b.htmlId ? `id="${b.htmlId}"` : ""; // Ajout de l'attribut id si htmlId est défini
                const childrenHtml = b.children ? renderBlocks(b.children) : "";
                if (b.tag === 'img') return `<img src="${content}" class="${className}" style="${styles}" data-block-id="${b.id}" ${htmlId} />`;
                if (b.tag === 'button') return `<button class="${className}" style="${styles}" data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</button>`;
                if (b.tag === 'a') return `<a href="${href}" class="${className}" style="${styles}" data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</a>`;
                return `<${b.tag} class="${className}" style="${styles}" data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</${b.tag}>`;
            }).join('\n');
        };
        return renderBlocks(currentPage.content);
    }, [currentPage?.content]);

    //mila modifiena am farany
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const globalCss = useMemo(() => {
        if (!currentPage?.styles) return "";
        try {
            const stylesObj = JSON.parse(currentPage.styles);
            return Object.entries(stylesObj)
                .map(([tag, style]) => `${tag} { ${style} }`)
                .join("\n");
        } catch (e) {
            console.log(e)
            return `body { ${currentPage.styles} }`;
        }
    }, [currentPage?.styles]);

    const handleSave = async () => {
        showToast("Saving project...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("Project saved successfully!");
        } catch (e) {
            console.error(e);
            showToast("Error saving project", "error");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
            {/* Header Commun */}
            <div className="p-4 flex items-center justify-between border-b border-couleur1/10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => editMode ? setEditMode(false) : navigateTo("Dashboard")}
                        className="p-2 rounded-xl border hover:bg-white transition-all"
                    >
                        <div className="flex items-center gap-1 pr-1">
                            <FcPrevious size={18} />
                            {editMode && <span className="text-[10px] font-bold uppercase text-couleur1">Retour</span>}
                        </div>
                    </button>
                    <h1 className="text-xl font-bold text-couleur1">
                        {editMode ? `Editing: ${currentPage?.nom}` : `Pages : ${projectName}`}
                    </h1>
                </div>
                <button onClick={handleSave} className="bg-couleur1 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                    <Save size={18} /> Save Project
                </button>
            </div>

            {/* Vue Conditionnelle */}
            <div className="flex-1 overflow-y-auto p-8">
                {editMode ? (
                    <div className="flex h-full min-h-150 relative">
                        {/* Left Sidebar: Structure & Blocks */}
                        <aside className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-80 bg-couleur3 dark:bg-gray-950 border-r border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xs font-black uppercase text-couleur1/40">Structure</h2>
                                <button onClick={() => setIsLeftSidebarOpen(false)} className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300">
                                    <X size={18} />
                                </button>
                            </div>
                            <VisualEditor
                                key={`left-${selectedPageIndex}`}
                                content={currentPage?.content}
                                availablePages={siteData?.pages || []}
                                activeBlock={activeBlock}
                                setActiveBlock={setActiveBlock}
                                activeTab="blocks"
                                allowedTabs={["blocks"]}
                                onChange={(blocks) => updatePageField("content", blocks)} />
                        </aside>

                        {/* Main content: Prévisualisation isolée (Iframe) */}
                        <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border border-couleur1/10 shadow-2xl overflow-hidden h-[calc(100vh-140px)] transition-all duration-300 ${isLeftSidebarOpen ? 'ml-80' : ''} ${isRightSidebarOpen ? 'mr-96' : ''}`}>
                            {!isLeftSidebarOpen && (
                                <button onClick={() => setIsLeftSidebarOpen(true)} className="absolute -top-8 -left-8 z-10 p-3 bg-couleur1 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                    <PanelRightOpen size={20} />
                                </button>
                            )}
                            {!isRightSidebarOpen && (
                                <button onClick={() => setIsRightSidebarOpen(true)} className="absolute right-4 top-24 z-10 p-3 bg-couleur1 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                    <PanelLeftOpen size={20} />
                                </button>
                            )}
                            
                            <div className="p-4 bg-couleur3/10 dark:bg-gray-800/50 border-b border-couleur1/5 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/40"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/40"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/40"></div>
                                </div>
                                <span className="text-[10px] font-bold text-couleur1/40 uppercase tracking-widest">Live Canvas Preview</span>
                                <div className="w-12"></div>
                            </div>
                            <iframe
                                title="Page Preview"
                                className="w-full h-full bg-white"
                                srcDoc={`
                                    <!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            
                                            <style>
                                                body { margin: 0; padding: 0; min-height: 100vh; font-family: sans-serif; }
                                                img { max-width: 100%; height: auto; }
                                                ${globalCss}
                                            </style>
                                        </head>
                                        <body>${previewHtml}</body>
                                    </html>
                                `}
                            />
                        </div>

                        {/* Right Sidebar: Properties & Global */}
                        <aside className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${isRightSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-96 bg-couleur3 dark:bg-gray-950 border-l border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xs font-black uppercase text-couleur1/40">Configuration</h2>
                                <button onClick={() => setIsRightSidebarOpen(false)} className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300">
                                    <X size={18} />
                                </button>
                            </div>
                            <VisualEditor
                                key={`right-${selectedPageIndex}`}
                                content={currentPage?.content}
                                pageStyles={currentPage?.styles || ""}
                                availablePages={siteData?.pages || []}
                                activeBlock={activeBlock}
                                setActiveBlock={setActiveBlock}
                                activeTab={rightActiveTab}
                                setActiveTab={setRightActiveTab}
                                allowedTabs={["global", "properties"]}
                                onChange={(blocks) => updatePageField("content", blocks)}
                                onPageStylesChange={(styles) => updatePageField("styles", styles)} />
                        </aside>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Liste des Pages */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-couleur1 dark:text-gray-200"><FileText size={18} /> Pages</h2>
                                <button onClick={addPage} className="p-2 bg-couleur1 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm">
                                    <Plus size={18} /> Add Page
                                </button>
                            </div>
                            {siteData?.pages?.map((page, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 flex justify-between items-center group hover:border-couleur1 transition-all">
                                    <div>
                                        <p className="font-bold text-couleur1">{page.nom}</p>
                                        <p className="text-xs opacity-50">{page.uri}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedPageIndex(index); setEditMode(true); }}
                                            className="p-2 bg-couleur1/5 text-couleur1 rounded-lg hover:bg-couleur1 hover:text-white transition-all"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => removePage(index)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* UI Components Placeholder */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Puzzle size={18} /> Components</h2>
                            <div className="h-64 border-2 border-dashed border-couleur1/10 rounded-3xl flex items-center justify-center text-couleur1/30">
                                Drag & Drop UI (Coming Soon)
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-10 right-10 z-100 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
                        toast.type === "loading" ? "bg-blue-50 border-blue-200 text-blue-700" :
                            "bg-green-50 border-green-200 text-green-700"
                    }`}>
                    {toast.type === "loading" ? <Loader2 size={18} className="animate-spin" /> :
                        toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
}