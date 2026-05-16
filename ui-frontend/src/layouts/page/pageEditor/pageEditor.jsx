import React, { useState, useEffect, useMemo } from "react";
import { GoApp } from "../../../services/bridge";
import {
    Save, FileText, Puzzle, Plus, Edit3, Trash2, Loader2, Type, X,
    PanelLeftOpen, CheckCircle, AlertCircle, PanelRightOpen, Smartphone, Tablet, Monitor
} from "lucide-react";
import VisualEditor from "./visualEditor";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../../../hooks/useNavigate";

export default function PageEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedPageIndex, setSelectedPageIndex] = useState(null);
    const [selectedComponentIndex, setSelectedComponentIndex] = useState(null);
    const [editingType, setEditingType] = useState('page'); // 'page' ou 'component'
    const [loading, setLoading] = useState(true);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [viewport, setViewport] = useState({
        width: "100%",
        height: "100%",
        name: "desktop"
    });
    const [zoomLevel, setZoomLevel] = useState(1); // New state for zoom
    const [toast, setToast] = useState(null);

    const [activeBlock, setActiveBlock] = useState(null);
    const [rightActiveTab, setRightActiveTab] = useState("properties");
    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;
    const typeKey = project?.type === "static" ? "site_statique" : "web_app";
    const activeItem = editingType === 'page'
        ? (selectedPageIndex !== null ? siteData?.pages[selectedPageIndex] : null)
        : (selectedComponentIndex !== null ? siteData?.[compKey]?.[selectedComponentIndex] : null);
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // New zoom handlers
    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 50%
    };

    const handleResetZoom = () => {
        setZoomLevel(1); // Reset to 100%
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

    // Create bindingsMap similar to VisualEditor.jsx for use in previewHtml
    const bindingsMap = useMemo(() => {
        const map = {};
        const controllers = siteData?.controllers || [];
        controllers
            .filter(ctrl => ctrl.page_nom === activeItem?.nom)
            .forEach(ctrl => {
                (ctrl.bindings || []).forEach(binding => {
                    if (binding.id_element) {
                        if (!map[binding.id_element]) map[binding.id_element] = [];
                        map[binding.id_element].push({ ...binding, ctrlName: ctrl.nom });
                    }
                });
            });
        return map;
    }, [siteData?.controllers, activeItem?.nom]);

    // Mise à jour générique d'un champ de l'élément actif (page ou composant)
    const updateActiveItemField = (field, value) => {
        setProject(prev => {
            if (!prev) return prev;
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";

            // Détection robuste de la clé des composants
            const actualCompKey = prev[typeKey]?.composants ? "composants" : "composant";
            const itemsKey = editingType === 'page' ? 'pages' : actualCompKey;

            const index = editingType === 'page' ? selectedPageIndex : selectedComponentIndex;

            if (index === null || !prev[typeKey] || !prev[typeKey][itemsKey] || !prev[typeKey][itemsKey][index]) {
                console.warn("Update failed: invalid index or path", { itemsKey, index });
                return prev;
            }

            const newItems = JSON.parse(JSON.stringify(prev[typeKey][itemsKey]));
            newItems[index] = { ...newItems[index], [field]: value };

            const updatedTypeData = { ...prev[typeKey], [itemsKey]: newItems };
            return { ...prev, [typeKey]: updatedTypeData };
        });
    };

    const addPage = () => {
        setProject(prev => {
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            const newPage = {
                id: Math.random().toString(36).substr(2, 9),
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
            const updatedPages = [...(prev[typeKey].pages || []), newPage];
            return { ...prev, [typeKey]: { ...prev[typeKey], pages: updatedPages } };
        });
    };

    const removePage = (index) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;
        setProject(prev => {
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            const updatedPages = prev[typeKey].pages.filter((_, i) => i !== index);
            return { ...prev, [typeKey]: { ...prev[typeKey], pages: updatedPages } };
        });
    };

    const addComponent = () => {
        setProject(prev => {
            if (!prev) return prev;
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            // On utilise la clé déjà existante ou on en crée une par défaut selon le type
            const actualCompKey = prev[typeKey]?.composants ? "composants" : (prev[typeKey]?.composant ? "composant" : (prev.type === "static" ? "composants" : "composant"));

            const newComponent = {
                id: Math.random().toString(36).substr(2, 9),
                nom: "New Component",
                content: []
            };
            const updatedComponents = [...(prev[typeKey][actualCompKey] || []), newComponent];
            return { ...prev, [typeKey]: { ...prev[typeKey], [actualCompKey]: updatedComponents } };
        });
    };

    const removeComponent = (index) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce composant ?")) return;
        setProject(prev => {
            if (!prev) return prev;
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            const actualCompKey = prev[typeKey]?.composants ? "composants" : "composant";
            const updatedComponents = prev[typeKey][actualCompKey].filter((_, i) => i !== index);
            return { ...prev, [typeKey]: { ...prev[typeKey], [actualCompKey]: updatedComponents } };
        });
    };



    // Détection de la clé de composant pour l'affichage (priorité au pluriel comme dans pagelist.jsx)
    const compKey = siteData?.composants ? "composants" : "composant";



    // Helper to generate controller indicator HTML
    const getControllerIndicatorHtml = (blockId) => {
        const bindings = bindingsMap[blockId];
        if (!bindings || bindings.length === 0) return '';
        return `<span class="controller-bound-indicator" title="Bound to: ${bindings.map(b => `${b.ctrlName} (${b.endpoint_nom} -> ${b.map_field})`).join(', ')}">CTRL</span>`;
    };

    // Convertit les blocs JSON en HTML pour la prévisualisation dans l'iframe
    const previewHtml = useMemo(() => {
        if (!activeItem?.content || !Array.isArray(activeItem.content)) return ""; // Utilise activeItem
        const renderBlocks = (blocks) => {
            return blocks.map(b => {
                const className = b.className || "";
                const styles = b.styles || "";
                const content = b.content || "";
                const href = b.href || "#";
                const htmlId = b.htmlId ? `id="${b.htmlId}"` : ""; // Ajout de l'attribut id si htmlId est défini
                const isJsonStyle = typeof styles === "string" && styles.trim().startsWith("{");
                const inlineStyleAttr = isJsonStyle ? "" : `style="${styles}"`;
                const childrenHtml = b.children ? renderBlocks(b.children) : "";

                const indicator = getControllerIndicatorHtml(b.id);

                if (b.tag === 'img') return `<img src="${content}" class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId} />${indicator}`; // Indicator next to img
                if (b.tag === 'button') return `<button class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${indicator}${content}${childrenHtml}</button>`;
                if (b.tag === 'a') return `<a href="${href}" class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${indicator}${content}${childrenHtml}</a>`;
                return `<${b.tag} class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${indicator}${content}${childrenHtml}</${b.tag}>`;
            }).join('\n');
        };
        return renderBlocks(activeItem.content);
    }, [activeItem.content, getControllerIndicatorHtml]); // Add bindingsMap to dependencies

    // Génère le CSS spécifique aux blocs pour chaque viewport
    const blocksCss = useMemo(() => {
        if (!activeItem?.content) return "";
        let css = "";
        const process = (blocks) => {
            blocks.forEach(b => {
                if (b.styles && typeof b.styles === 'string' && b.styles.trim().startsWith("{")) {
                    try {
                        const obj = JSON.parse(b.styles);
                        const format = (s) => Object.entries(s || {}).map(([p, v]) => `${p}: ${v};`).join(" ");
                        if (obj.desktop) css += `[data-block-id="${b.id}"] { ${format(obj.desktop)} }\n`;
                        if (obj.tablet) css += `@media (max-width: 1024px) { [data-block-id="${b.id}"] { ${format(obj.tablet)} } }\n`;
                        if (obj.mobile) css += `@media (max-width: 768px) { [data-block-id="${b.id}"] { ${format(obj.mobile)} } }\n`;
                    } catch (e) {
                        console.error(e)
                    }
                }
                if (b.children) process(b.children);
            });
        };
        process(activeItem.content);
        return css;
    }, [activeItem?.content]);

    //mila modifiena am farany
    const globalCss = useMemo(() => {
        if (!activeItem?.styles) return ""; // Utilise activeItem
        try {
            const stylesObj = JSON.parse(activeItem.styles);
            const format = (s) => Object.entries(s || {}).map(([tag, style]) => `${tag} { ${style} }`).join("\n");
            if (stylesObj.desktop || stylesObj.tablet || stylesObj.mobile) {
                let css = format(stylesObj.desktop);
                if (stylesObj.tablet) css += `\n@media (max-width: 1024px) {\n${format(stylesObj.tablet)}\n}`;
                if (stylesObj.mobile) css += `\n@media (max-width: 768px) {\n${format(stylesObj.mobile)}\n}`;
                return css;
            }
            return format(stylesObj);
        } catch (e) {
            console.log(e)
            return `body { ${activeItem.styles} }`; // Utilise activeItem
        }
    }, [activeItem?.styles]);

    const handleSave = async () => {
        showToast("Saving project...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("Project saved successfully!");
            console.log(project)
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
                        {editMode ? (
                            <div className="flex items-center gap-2">
                                <span className="opacity-50 text-xs uppercase">Edit {editingType}:</span>
                                <input
                                    value={activeItem?.nom}
                                    onChange={(e) => updateActiveItemField('nom', e.target.value)}
                                    className="bg-transparent border-b border-couleur1/20 focus:border-couleur1 outline-none px-1"
                                />
                            </div>
                        ) : `Project : ${projectName}`}
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
                                key={`left-${editingType}-${editingType === 'page' ? selectedPageIndex : selectedComponentIndex}`}
                                content={activeItem?.content}
                                availablePages={siteData?.pages || []}
                                availableComponents={siteData?.[compKey] || []}
                                activeBlock={activeBlock}
                                setActiveBlock={setActiveBlock}
                                activeTab="blocks"
                                activeViewport={viewport.name}
                                allowedTabs={["blocks"]}
                                onChange={(blocks) => updateActiveItemField("content", blocks)}
                                showToast={showToast}
                            />
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
                                <div className="flex items-center gap-4">
                                    {/* Sélecteurs de Viewport */}
                                    <div className="flex items-center bg-white/50 dark:bg-gray-800 rounded-lg p-1 shadow-inner border border-couleur1/5">
                                        <button
                                            onClick={() => setViewport({ width: "375px", height: "667px", name: "mobile" })}
                                            className={`p-1.5 rounded-md transition-all ${viewport.name === "mobile" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                                            title="Mobile (375x667)"
                                        ><Smartphone size={14} /></button>
                                        <button
                                            onClick={() => setViewport({ width: "768px", height: "1024px", name: "tablet" })}
                                            className={`p-1.5 rounded-md transition-all ${viewport.name === "tablet" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                                            title="Tablette (768x1024)"
                                        ><Tablet size={14} /></button>
                                        <button
                                            onClick={() => setViewport({ width: "100%", height: "100%", name: "desktop" })}
                                            className={`p-1.5 rounded-md transition-all ${viewport.name === "desktop" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                                            title="Bureau (Plein écran)"
                                        ><Monitor size={14} /></button>
                                    </div>

                                    <span className="text-[10px] font-bold text-couleur1/40 uppercase tracking-widest">Live Canvas Preview</span>
                                    {/* Zoom Controls */}
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleZoomOut} className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs">
                                            -
                                        </button>
                                        <span className="text-sm font-medium text-couleur1 dark:text-gray-300">{Math.round(zoomLevel * 100)}%</span>
                                        <button onClick={handleZoomIn} className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs">
                                            +
                                        </button>
                                        <button onClick={handleResetZoom} className="ml-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs">
                                            Reset
                                        </button>
                                    </div>
                                </div>


                                <div className="w-12"></div>
                            </div>
                            <div className="flex-1 overflow-auto flex justify-center items-start bg-gray-100 dark:bg-gray-800/30  custom-scrollbar">
                                <iframe
                                    title="Page Preview"
                                    style={{
                                        width: viewport.width,
                                        height: viewport.height,
                                        transform: `scale(${zoomLevel})`, // Correction ici
                                        transformOrigin: 'top center' // Correction ici
                                    }}
                                    className="bg-white shadow-2xl transition-all duration-500 ease-in-out border border-couleur1/10 rounded-sm"
                                    srcDoc={`
                                    <!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            
                                            <!-- Base styles for controller indicator -->
                                            <style>
                                                .controller-bound-indicator {
                                                    display: inline-block;
                                                    background-color: #4F46E5; /* Indigo-600 */
                                                    color: white;
                                                    font-size: 0.6rem;
                                                    font-weight: bold;
                                                    padding: 2px 4px;
                                                    border-radius: 4px;
                                                    margin-right: 4px;
                                                    line-height: 1;
                                                    vertical-align: middle;
                                                }
                                            </style>
                                            <style>
                                                body { margin: 0; padding: 0; min-height: 100vh; font-family: sans-serif; }
                                                img { max-width: 100%; height: auto; }
                                                ${globalCss}
                                                ${blocksCss}
                                            </style>
                                        </head>
                                        <body>${previewHtml}</body>
                                    </html>
                                `}
                                />
                            </div>
                        </div>

                        {/* Right Sidebar: Properties & Global */}
                        <aside className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} w-96 bg-couleur3 dark:bg-gray-950 border-l border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xs font-black uppercase text-couleur1/40">Configuration</h2>
                                <button onClick={() => setIsRightSidebarOpen(false)} className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300">
                                    <X size={18} />
                                </button>
                            </div>
                            <VisualEditor
                                key={`right-${editingType}-${editingType === 'page' ? selectedPageIndex : selectedComponentIndex}`}
                                content={activeItem?.content}
                                pageStyles={activeItem?.styles || ""}
                                availablePages={siteData?.pages || []}
                                availableComponents={siteData?.[compKey] || []}
                                activeBlock={activeBlock}
                                setActiveBlock={setActiveBlock}
                                activeTab={rightActiveTab}
                                setActiveTab={setRightActiveTab}
                                activeViewport={viewport.name}
                                allowedTabs={editingType === 'page' ? ["global", "properties", "data"] : ["properties"]}
                                availableControllers={siteData?.controllers || []}
                                currentPageName={activeItem?.nom}
                                onUpdateControllers={(newCtrls) => setProject(prev => ({ ...prev, [typeKey]: { ...prev[typeKey], controllers: newCtrls } }))}
                                onChange={(blocks) => updateActiveItemField("content", blocks)}
                                onPageStylesChange={(styles) => updateActiveItemField("styles", styles)}
                                showToast={showToast}
                            />
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
                                <div key={page.id || index} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 flex justify-between items-center group hover:border-couleur1 transition-all">
                                    <div>
                                        <p className="font-bold text-couleur1">{page.nom}</p>
                                        <p className="text-xs opacity-50">{page.uri}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedPageIndex(index); setEditingType('page'); setEditMode(true); }}
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

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-couleur1 dark:text-gray-200 flex items-center gap-2"><Puzzle size={18} /> Components</h2>
                                <button onClick={addComponent} className="p-2 bg-couleur1 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm">
                                    <Plus size={18} /> Add Component
                                </button>
                            </div>
                            <div className="space-y-3">
                                {siteData?.[compKey]?.map((comp, index) => (
                                    <div key={comp.id || index} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-couleur1/10 dark:border-white/5 flex justify-between items-center group hover:border-couleur1 transition-all">
                                        <div>
                                            <p className="font-bold text-couleur1">{comp.nom}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelectedComponentIndex(index); setEditingType('component'); setEditMode(true); }}
                                                className="p-2 bg-couleur1/5 text-couleur1 rounded-lg hover:bg-couleur1 hover:text-white transition-all"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => removeComponent(index)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!siteData?.[compKey] || siteData[compKey].length === 0) && (
                                    <div className="h-32 border-2 border-dashed border-couleur1/10 rounded-3xl flex items-center justify-center text-couleur1/30 italic text-sm">
                                        No components created yet.
                                    </div>
                                )}
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