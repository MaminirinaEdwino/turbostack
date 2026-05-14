import React, { useState, useEffect } from "react";
import { GoApp } from "../../../services/bridge";
import { Save, FileText, Puzzle, Plus, Edit3, Trash2, Loader2, Globe, Type } from "lucide-react";
import VisualEditor from "./visualEditor";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../../../hooks/useNavigate";

export default function PageEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedPageIndex, setSelectedPageIndex] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleSave = async () => {
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            // console.log("page", project)
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;
    const currentPage = selectedPageIndex !== null ? siteData?.pages[selectedPageIndex] : null;

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
            {/* Header Commun */}
            <div className="p-4 flex items-center justify-between border-b border-couleur1/10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => editMode ? setEditMode(false) : navigateTo("Dashboard")}
                        className="p-2 rounded-xl border hover:bg-white transition-all"
                    >
                        <FcPrevious size={20} />
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
                    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                        {/* Barre de configuration de la page */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-couleur1/10 shadow-sm">
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
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase flex items-center gap-1">
                                    <Globe size={10}/> Path (URI)
                                </label>
                                <input
                                    className="bg-couleur3/30 dark:bg-gray-800 p-2.5 rounded-xl border-none outline-none focus:ring-2 ring-couleur1/20 font-mono text-sm text-couleur1 dark:text-white"
                                    value={currentPage?.uri || ""}
                                    onChange={(e) => updatePageField("uri", e.target.value)}
                                />
                            </div>
                        </div>
                        <VisualEditor key={selectedPageIndex} content={currentPage?.content} onChange={(blocks) => updatePageField("content", blocks)} />
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