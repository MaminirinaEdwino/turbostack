import { useState, useEffect, useMemo } from "react";
import { 
    Save, Plus, Edit3, Trash2, Loader2, Cpu, FileText, Settings, 
    CheckCircle, AlertCircle, Link as LinkIcon, ArrowRight, Wand2,
    Zap, Activity, Database, Link2
} from "lucide-react";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../hooks/useNavigate";
import { GoApp } from "../services/bridge";

export default function ControllerEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [toast, setToast] = useState(null);
    const [bulkEndpointNom, setBulkEndpointNom] = useState("");

    // 1. TOUS LES HOOKS EN PREMIER (Ordre immuable)
    
    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            const res = await GoApp.fetchProjectByName(projectName);
            if (res) setProject(res);
            setLoading(false);
        };
        loadProject();
    }, [projectName]);

    // Calcul des données dérivées pour le useMemo
    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;
    const typeKey = project?.type === "static" ? "site_statique" : "web_app";
    const controllers = siteData?.controllers || [];
    const pages = siteData?.pages || [];
    const endpoints = project?.rest_api?.endpoints || [];
    
    const activeController = selectedIndex !== null ? controllers[selectedIndex] : null;
    const activeBindings = activeController?.bindings;

    // CORRECTION : useMemo placé avant tout "return" conditionnel
    const groupedBindings = useMemo(() => {
        const groups = {};
        if (!activeBindings) return groups;

        activeBindings.forEach((binding, index) => {
            const epNom = binding.endpoint_nom || "Unlinked";
            if (!groups[epNom]) {
                groups[epNom] = [];
            }
            groups[epNom].push({ ...binding, originalIndex: index });
        });
        return groups;
    }, [activeBindings]);

    useEffect(() => {
        if (endpoints.length > 0 && !bulkEndpointNom) {
            setBulkEndpointNom(endpoints[0].nom);
        }
    }, [endpoints, bulkEndpointNom]);

    // 2. FONCTIONS DE LOGIQUE

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") setTimeout(() => setToast(null), 3000);
    };

    const updateController = (index, field, value) => {
        setProject(prev => {
            const k = prev.type === "static" ? "site_statique" : "web_app";
            const newControllers = [...(prev[k].controllers || [])];
            const currentCtrl = newControllers[index];
            const nextValue = typeof value === 'function' ? value(currentCtrl[field]) : value;
            newControllers[index] = { ...currentCtrl, [field]: nextValue };
            return { ...prev, [k]: { ...prev[k], controllers: newControllers } };
        });
    };

    const getIdsFromContent = (content) => {
        let ids = [];
        if (!content) return ids;
        content.forEach(item => {
            if (item.id) ids.push(item.id);
            if (item.children) ids = [...ids, ...getIdsFromContent(item.children)];
        });
        return ids;
    };

    const availableIds = activeController 
        ? getIdsFromContent(pages.find(p => p.nom === activeController.page_nom)?.content) 
        : [];

    const generateBindingsFromEndpoint = (endpointNom) => {
        if (!endpointNom || selectedIndex === null) return;
        const ep = endpoints.find(e => e.nom === endpointNom);
        if (!ep) return;

        const fields = [];
        ep.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
        ep.params?.forEach(p => fields.push(p));

        if (fields.length === 0) {
            showToast("No fields found in this endpoint", "error");
            return;
        }

        const newBindings = fields.map(f => ({
            id_element: availableIds.find(id => id.toLowerCase().includes(f.toLowerCase())) || (availableIds[0] || ""),
            endpoint_nom: ep.nom,
            trigger: "onLoad",
            action: "fill_content",
            map_field: f
        }));

        updateController(selectedIndex, 'bindings', (prev) => [...(prev || []), ...newBindings]);
        showToast(`${newBindings.length} bindings generated!`);
    };

    const handleSave = async () => {
        showToast("Saving controllers...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("Controllers saved!");
        } catch (e) {
            showToast("Error saving", "error");
        }
    };

    // 3. RENDUS CONDITIONNELS (Après les hooks)

    if (loading) return <div className="flex h-screen items-center justify-center bg-couleur3"><Loader2 className="animate-spin text-couleur1" /></div>;

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-couleur1/10 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => editMode ? setEditMode(false) : navigateTo("Dashboard")} className="p-2 rounded-xl border hover:bg-white transition-all">
                        <FcPrevious size={18} />
                    </button>
                    <h1 className="text-xl font-bold text-couleur1 flex items-center gap-2">
                        <Cpu size={24} /> Controller Editor : {projectName}
                    </h1>
                </div>
                <button onClick={handleSave} className="bg-couleur1 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                    <Save size={18} /> Save All
                </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                {!editMode ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-couleur1">Project Logic</h2>
                            <button onClick={() => {
                                const newController = { nom: "New Controller", page_nom: pages[0]?.nom || "", bindings: [] };
                                setProject(prev => ({
                                    ...prev, [typeKey]: { ...prev[typeKey], controllers: [...(prev[typeKey].controllers || []), newController] }
                                }));
                            }} className="bg-couleur1 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                                <Plus size={18} /> Add Controller
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {controllers.map((ctrl, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-couleur1/10 text-couleur1 rounded-xl"><Cpu size={24} /></div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedIndex(index); setEditMode(true); }} className="p-2 hover:bg-couleur1/5 text-couleur1 rounded-lg"><Edit3 size={18} /></button>
                                            <button onClick={() => setProject(prev => {
                                                const newControllers = prev[typeKey].controllers.filter((_, i) => i !== index);
                                                return { ...prev, [typeKey]: { ...prev[typeKey], controllers: newControllers } };
                                            })} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-couleur1 mb-1">{ctrl.nom}</h3>
                                    <div className="flex items-center gap-2 text-xs opacity-60">
                                        <FileText size={12} /> Page: {ctrl.page_nom || "Not set"}
                                    </div>
                                    <div className="mt-2 text-[10px] font-bold uppercase opacity-40">{ctrl.bindings?.length || 0} Bindings Active</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-couleur1/10 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-couleur1/10 bg-couleur1/5 flex justify-between items-center">
                            <input 
                                value={activeController?.nom || ""} 
                                onChange={(e) => updateController(selectedIndex, 'nom', e.target.value)}
                                className="bg-transparent text-xl font-bold text-couleur1 outline-none border-b border-transparent focus:border-couleur1"
                            />
                            <button onClick={() => setEditMode(false)} className="text-couleur1/50 hover:text-couleur1 uppercase text-xs font-black">Close</button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2"><FileText size={14}/> Target Page</label>
                                    <select 
                                        value={activeController?.page_nom || ""}
                                        onChange={(e) => updateController(selectedIndex, 'page_nom', e.target.value)}
                                        className="w-full p-4 rounded-2xl border border-couleur1/10 bg-couleur3/30 outline-none"
                                    >
                                        <option value="">Select a page...</option>
                                        {pages.map(p => <option key={p.nom} value={p.nom}>{p.nom}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-couleur1/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black uppercase text-couleur1/40 flex items-center gap-2">
                                        <LinkIcon size={16} /> Data Bindings
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-couleur1/10 rounded-xl px-3 py-1.5 shadow-sm">
                                            <select 
                                                value={bulkEndpointNom}
                                                onChange={(e) => setBulkEndpointNom(e.target.value)}
                                                className="text-[10px] font-black uppercase outline-none bg-transparent max-w-[140px] text-couleur1/60"
                                            >
                                                {endpoints.map(ep => <option key={ep.nom} value={ep.nom}>{ep.nom}</option>)}
                                            </select>
                                            <button 
                                                onClick={() => generateBindingsFromEndpoint(bulkEndpointNom)}
                                                className="p-1 text-couleur1 hover:scale-110 transition-all border-l border-couleur1/10 pl-3 ml-1"
                                            >
                                                <Wand2 size={14} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newBinding = { id_element: availableIds[0] || "", endpoint_nom: endpoints[0]?.nom || "", trigger: "onLoad", action: "fill_content", map_field: "" };
                                                updateController(selectedIndex, 'bindings', (prev) => [...(prev || []), newBinding]);
                                            }}
                                            className="text-xs bg-couleur1 text-white px-4 py-2 rounded-xl flex items-center gap-1.5"
                                        >
                                            <Plus size={14} /> Add Binding
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-10">
                                    {Object.entries(groupedBindings).map(([endpointNom, bindingsGroup]) => (
                                        <div key={endpointNom} className="space-y-4 border-l-2 border-couleur1/10 pl-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Database size={14} className="text-couleur1/40" />
                                                <span className="text-[10px] font-black uppercase text-couleur1/40 tracking-[0.2em]">Endpoint: {endpointNom}</span>
                                            </div>
                                            {bindingsGroup.map((binding) => (
                                                <BindingRow 
                                                    key={binding.originalIndex} 
                                                    binding={binding} 
                                                    availableIds={availableIds}
                                                    endpoints={endpoints}
                                                    onDelete={() => {
                                                        updateController(selectedIndex, 'bindings', (prev) => 
                                                            prev.filter((_, i) => i !== binding.originalIndex)
                                                        );
                                                    }}
                                                    onChange={(newVal) => {
                                                        updateController(selectedIndex, 'bindings', (prev) => {
                                                            const next = [...prev];
                                                            next[binding.originalIndex] = newVal;
                                                            return next;
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {toast && (
                <div className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border ${
                    toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
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

function BindingRow({ binding, availableIds, endpoints, onChange, onDelete }) {
    const selectedEp = useMemo(() => 
        endpoints.find(ep => ep.nom === binding.endpoint_nom), 
    [endpoints, binding.endpoint_nom]);

    const fieldSuggestions = useMemo(() => {
        if (!selectedEp) return [];
        let fields = [];
        selectedEp.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
        selectedEp.params?.forEach(p => fields.push(p));
        return [...new Set(fields)];
    }, [selectedEp]);

    return (
        <div className="group bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-couleur1/5 hover:border-couleur1/20 transition-all">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-couleur1/10 flex items-center justify-center text-couleur1"><Link2 size={16}/></div>
                    <span className="text-[10px] font-black uppercase text-couleur1/40">Logic Node</span>
                </div>
                <button onClick={onDelete} className="p-2 text-red-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-couleur1/30">Trigger</label>
                    <select 
                        value={binding.trigger} 
                        onChange={(e) => onChange({...binding, trigger: e.target.value})} 
                        className="w-full p-3 text-xs rounded-xl border border-couleur1/10 bg-couleur3/20 outline-none"
                    >
                        <option value="onLoad">onLoad</option>
                        <option value="onClick">onClick</option>
                        <option value="onHover">onHover</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-couleur1/30">Action</label>
                    <select 
                        value={binding.action} 
                        onChange={(e) => onChange({...binding, action: e.target.value})} 
                        className="w-full p-3 text-xs rounded-xl border border-couleur1/10 bg-couleur3/20 outline-none"
                    >
                        <option value="fill_content">Fill Content</option>
                        <option value="set_style">Set Style</option>
                        <option value="redirect">Redirect</option>
                    </select>
                </div>
                {/* <div className="space-y-2 col-span-full">
                    <label className="text-[9px] uppercase font-black text-couleur1/30">Target Element (ID)</label>
                    <select 
                        value={binding.id_element} 
                        onChange={(e) => onChange({...binding, id_element: e.target.value})} 
                        className="w-full p-3 text-xs rounded-xl border border-couleur1/10 bg-couleur3/20 outline-none"
                    >
                        {availableIds.map(id => <option key={id} value={id}>{id}</option>)}
                    </select>
                </div> */}
                <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-couleur1/30">Field Mapping (JSON Path)</label>
                    <input 
                        list={`fields-${binding.id_element}`}
                        value={binding.map_field} 
                        placeholder="ex: data.title" 
                        onChange={(e) => onChange({...binding, map_field: e.target.value})} 
                        className="w-full p-4 text-sm font-mono rounded-xl border border-couleur1/10 bg-white dark:bg-gray-900 outline-none"
                    />
                    <datalist id={`fields-${binding.id_element}`}>
                        {fieldSuggestions.map(f => <option key={f} value={f} />)}
                    </datalist>
                </div>
            </div>
        </div>
    );
}