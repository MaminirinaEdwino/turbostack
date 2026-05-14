import React, { useState, useEffect, useMemo } from "react";
import { GoApp } from "../../../services/bridge";
import { Save, FileText, Puzzle, Plus, Edit3, Trash2, Loader2, Type, X, PanelLeftOpen } from "lucide-react"; // Added X, PanelLeftOpen
import VisualEditor from "./visualEditor";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../../../hooks/useNavigate";

export default function PageEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedPageIndex, setSelectedPageIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // New state for sidebar visibility
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        loadProject();
    }, [projectName]);

    const loadProject = async () => {
        setLoading(true);
        const res = await GoApp.fetchProjectByName(projectName);
        if (res) setProject(res);
        setLoading(false);
    };

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
    const previewHtml = useMemo(() => {
        if (!currentPage?.content || !Array.isArray(currentPage.content)) return "";
        return currentPage.content.map(b => {
            const className = b.className || "";
            const styles = b.styles || "";
            const content = b.content || "";
            if (b.tag === 'img') return `<img src="${content}" class="${className}" style="${styles}" />`;
            if (b.tag === 'button') return `<button class="${className}" style="${styles}">${content}</button>`;
            return `<${b.tag} class="${className}" style="${styles}">${content}</${b.tag}>`;
        }).join('\n');
    }, [currentPage?.content]);

    const handleSave = async () => {
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            // console.log("page", project)
        } catch (e) { console.error(e); }
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
                    <div className="flex h-full min-h-[600px]"> {/* Changed to flex container */}
                        {/* Main content: Prévisualisation isolée (Iframe) */}
                        <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border border-couleur1/10 shadow-2xl overflow-hidden h-[calc(100vh-140px)] animate-in slide-in-from-left-4 duration-500 ${isSidebarOpen ? 'mr-96' : ''}`}>
                            {/* Button to open sidebar (if closed) */}
                            {!isSidebarOpen && (
                                <button onClick={() => setIsSidebarOpen(true)} className="absolute  right-4 z-10 p-3 bg-couleur1 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                    <PanelLeftOpen size={24} />
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
                                            </style>
                                        </head>
                                        <body>${previewHtml}</body>
                                    </html>
                                `}
                                />
                        </div>

                        {/* Sidebar: Édition des blocs (collapsible) */}
                        <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} w-96 bg-couleur3 dark:bg-gray-950 border-l border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto`}>
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-couleur1/10 shadow-sm">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase flex items-center gap-1">
                                        <Type size={10}/> Page Name
                                    </label>
                                    <input
                                        className="bg-couleur3/30 dark:bg-gray-800 p-2.5 rounded-xl border-none outline-none focus:ring-2 ring-couleur1/20 font-bold text-couleur1 dark:text-white"
                                        value={currentPage?.nom || ""}
                                        onChange={(e) => updatePageField("nom", e.target.value)}
                                    />
                                </div>
                            </div>
                            <VisualEditor key={selectedPageIndex} content={currentPage?.content} onChange={(blocks) => updatePageField("content", blocks)} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Liste des Pages */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-couleur1 dark:text-gray-200"><FileText size={18}/> Pages</h2>
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
                            <h2 className="text-lg font-bold flex items-center gap-2"><Puzzle size={18}/> Components</h2>
                            <div className="h-64 border-2 border-dashed border-couleur1/10 rounded-3xl flex items-center justify-center text-couleur1/30">
                                Drag & Drop UI (Coming Soon)
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}