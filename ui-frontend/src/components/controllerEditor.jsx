import { useState, useEffect, useMemo } from "react";
import { 
    Save, Plus, Edit3, Trash2, Loader2, Cpu, FileText, Settings, 
    CheckCircle, AlertCircle, Link as LinkIcon, ArrowRight, Wand2
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

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            const res = await GoApp.fetchProjectByName(projectName);
            if (res) setProject(res);
            setLoading(false);
        };
        loadProject();
    }, [projectName]);

    const siteData = project?.type === "static" ? project?.site_statique : project?.web_app;
    const typeKey = project?.type === "static" ? "site_statique" : "web_app";
    const controllers = siteData?.controllers || [];
    const pages = siteData?.pages || [];
    const endpoints = project?.rest_api?.endpoints || [];

    // Initialise la sélection de l'endpoint pour la génération en masse
    useEffect(() => {
        if (endpoints.length > 0 && !bulkEndpointNom) {
            setBulkEndpointNom(endpoints[0].nom);
        }
    }, [endpoints, bulkEndpointNom]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") setTimeout(() => setToast(null), 3000);
    };

    const updateController = (index, field, value) => {
        setProject(prev => {
            const newControllers = [...(prev[typeKey].controllers || [])];
            newControllers[index] = { ...newControllers[index], [field]: value };
            return { ...prev, [typeKey]: { ...prev[typeKey], controllers: newControllers } };
        });
    };

    const addController = () => {
        const newController = {
            nom: "New Controller",
            page_nom: pages[0]?.nom || "",
            bindings: []
        };
        setProject(prev => ({
            ...prev,
            [typeKey]: { ...prev[typeKey], controllers: [...(prev[typeKey].controllers || []), newController] }
        }));
    };

    const generateBindingsFromEndpoint = (endpointNom) => {
        if (!endpointNom) return;
        const ep = endpoints.find(e => e.nom === endpointNom);
        if (!ep) return;

        const fields = [];
        // Extraction de tous les champs possibles de l'endpoint
        ep.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
        ep.params?.forEach(p => fields.push(p));

        if (fields.length === 0) {
            showToast("No fields found in this endpoint", "error");
            return;
        }

        const newBindings = fields.map(f => {
            // Tentative de matching intelligent avec les IDs de la page
            const bestMatch = availableIds.find(id => 
                id.toLowerCase().includes(f.toLowerCase()) || 
                f.toLowerCase().includes(id.toLowerCase())
            );
            return {
                id_element: bestMatch || (availableIds[0] || ""),
                endpoint_nom: ep.nom,
                trigger: "onLoad",
                action: "fill_content",
                map_field: f
            };
        });

        updateController(selectedIndex, 'bindings', [...(activeController.bindings || []), ...newBindings]);
        showToast(`${newBindings.length} bindings generated!`);
    };

    const handleSave = async () => {
        showToast("Saving controllers...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            console.log(project)
            showToast("Controllers saved!");
        } catch (e) {
            console.log(e)
            showToast("Error saving", "error");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-couleur3"><Loader2 className="animate-spin text-couleur1" /></div>;

    const activeController = selectedIndex !== null ? controllers[selectedIndex] : null;

    // Helper pour extraire tous les IDs d'éléments d'une page
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
                            <button onClick={addController} className="bg-couleur1 text-white px-4 py-2 rounded-xl flex items-center gap-2">
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
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-couleur1/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-couleur1/10 bg-couleur1/5 flex justify-between items-center">
                            <input 
                                value={activeController?.nom} 
                                onChange={(e) => updateController(selectedIndex, 'nom', e.target.value)}
                                className="bg-transparent text-xl font-bold text-couleur1 outline-none border-b border-transparent focus:border-couleur1"
                            />
                            <button onClick={() => setEditMode(false)} className="text-couleur1/50 hover:text-couleur1 uppercase text-xs font-black">Close</button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Step 1: Connections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2"><FileText size={14}/> Target Page</label>
                                    <select 
                                        value={activeController?.page_nom}
                                        onChange={(e) => updateController(selectedIndex, 'page_nom', e.target.value)}
                                        className="w-full p-4 rounded-2xl border border-couleur1/10 bg-couleur3/30 outline-none focus:ring-2 ring-couleur1/20 transition-all"
                                    >
                                        {pages.map(p => <option key={p.nom} value={p.nom}>{p.nom} ({p.uri})</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Step 2: Bindings (DataBindingJSON) */}
                            <div className="pt-8 border-t border-couleur1/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black uppercase text-couleur1/40 flex items-center gap-2">
                                        <LinkIcon size={16} /> Data Bindings
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-couleur1/20 rounded-xl px-2 py-1">
                                            <select 
                                                value={bulkEndpointNom}
                                                onChange={(e) => setBulkEndpointNom(e.target.value)}
                                                className="text-[10px] font-bold uppercase outline-none bg-transparent max-w-[120px]"
                                            >
                                                {endpoints.map(ep => <option key={ep.nom} value={ep.nom}>{ep.nom}</option>)}
                                            </select>
                                            <button 
                                                onClick={() => generateBindingsFromEndpoint(bulkEndpointNom)}
                                                className="p-1 text-couleur1 hover:scale-110 transition-all border-l border-couleur1/10 pl-2"
                                                title="Generate mappings for all fields in this endpoint"
                                            >
                                                <Wand2 size={14} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newBinding = { id_element: availableIds[0] || "", endpoint_nom: endpoints[0]?.nom || "", trigger: "onLoad", action: "fill_content", map_field: "" };
                                                updateController(selectedIndex, 'bindings', [...(activeController.bindings || []), newBinding]);
                                            }}
                                            className="text-xs bg-couleur1 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Binding
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {activeController.bindings?.map((binding, bIndex) => (
                                        <BindingRow 
                                            key={bIndex} 
                                            binding={binding} 
                                            availableIds={availableIds}
                                            endpoints={endpoints}
                                            onDelete={() => {
                                                const newBindings = activeController.bindings.filter((_, i) => i !== bIndex);
                                                updateController(selectedIndex, 'bindings', newBindings);
                                            }}
                                            onChange={(newVal) => {
                                                const newBindings = [...activeController.bindings];
                                                newBindings[bIndex] = newVal;
                                                updateController(selectedIndex, 'bindings', newBindings);
                                            }}
                                        />
                                    ))}
                                    {(!activeController.bindings || activeController.bindings.length === 0) && (
                                        <div className="text-center p-8 border-2 border-dashed border-couleur1/10 rounded-2xl text-couleur1/30 italic text-sm">
                                            No bindings defined for this controller.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${
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
    // Extraction automatique des suggestions basées sur l'endpoint sélectionné
    const selectedEp = useMemo(() => 
        endpoints.find(ep => ep.nom === binding.endpoint_nom), 
    [endpoints, binding.endpoint_nom]);

    const fieldSuggestions = useMemo(() => {
        if (!selectedEp) return [];
        let fields = [];
        // Champs issus des modèles associés (souvent la structure de réponse ou du body)
        selectedEp.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
        // Paramètres de l'URI
        selectedEp.params?.forEach(p => fields.push(p));
        return [...new Set(fields)]; // Unicité
    }, [selectedEp]);

    const handleAutoMap = () => {
        if (!fieldSuggestions.length) return;
        const bestMatch = fieldSuggestions.find(f => 
            binding.id_element.toLowerCase().includes(f.toLowerCase()) || 
            f.toLowerCase().includes(binding.id_element.toLowerCase())
        );
        onChange({ ...binding, map_field: bestMatch || fieldSuggestions[0] });
    };

    return (
        <div className="bg-couleur3/10 p-4 rounded-2xl border border-couleur1/5 space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-couleur1/40">Binding Configuration</span>
                <button onClick={onDelete} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold opacity-50">Element ID</label>
                    <select value={binding.id_element} onChange={(e) => onChange({...binding, id_element: e.target.value})} className="p-2 text-xs rounded-lg border bg-white">
                        {availableIds.map(id => <option key={id} value={id}>{id}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold opacity-50">Endpoint</label>
                    <select value={binding.endpoint_nom} onChange={(e) => onChange({...binding, endpoint_nom: e.target.value})} className="p-2 text-xs rounded-lg border bg-white">
                        {endpoints.map(ep => <option key={ep.nom} value={ep.nom}>{ep.nom}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold opacity-50">Trigger</label>
                    <select value={binding.trigger} onChange={(e) => onChange({...binding, trigger: e.target.value})} className="p-2 text-xs rounded-lg border bg-white">
                        <option value="onLoad">onLoad</option>
                        <option value="onClick">onClick</option>
                        <option value="onHover">onHover</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold opacity-50">Action</label>
                    <select value={binding.action} onChange={(e) => onChange({...binding, action: e.target.value})} className="p-2 text-xs rounded-lg border bg-white">
                        <option value="fill_content">Fill Content</option>
                        <option value="set_style">Set Style</option>
                        <option value="redirect">Redirect</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[9px] uppercase font-bold opacity-50">Field Mapping (JSON Path)</label>
                    <div className="relative flex items-center">
                        <input 
                            list={`fields-${binding.id_element}`}
                            value={binding.map_field} 
                            placeholder="ex: data.title" 
                            onChange={(e) => onChange({...binding, map_field: e.target.value})} 
                            className="w-full p-2 pr-10 text-xs rounded-lg border bg-white outline-none focus:ring-1 ring-couleur1"
                        />
                        <button 
                            onClick={handleAutoMap}
                            className="absolute right-2 p-1 text-couleur1/40 hover:text-couleur1 transition-colors"
                            title="Suggest field"
                        >
                            <Wand2 size={14} />
                        </button>
                    </div>
                    <datalist id={`fields-${binding.id_element}`}>
                        {fieldSuggestions.map(f => (
                            <option key={f} value={f} />
                        ))}
                    </datalist>
                </div>
            </div>
        </div>
    );
}
