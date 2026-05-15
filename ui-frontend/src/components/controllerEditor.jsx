import { useState, useEffect } from "react";
import { 
    Save, Plus, Edit3, Trash2, Loader2, Cpu, FileText, Settings, 
    CheckCircle, AlertCircle, Link as LinkIcon, ArrowRight
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
            id: Math.random().toString(36).substr(2, 9),
            nom: "New Controller",
            pageId: pages[0]?.id || "",
            endpointIndex: 0,
            mappings: {}
        };
        setProject(prev => ({
            ...prev,
            [typeKey]: { ...prev[typeKey], controllers: [...(prev[typeKey].controllers || []), newController] }
        }));
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
    const activeEndpoint = activeController ? endpoints[activeController.endpointIndex] : null;

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
                                <div key={ctrl.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-couleur1/10 text-couleur1 rounded-xl"><Cpu size={24} /></div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedIndex(index); setEditMode(true); }} className="p-2 hover:bg-couleur1/5 text-couleur1 rounded-lg"><Edit3 size={18} /></button>
                                            <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-couleur1 mb-1">{ctrl.nom}</h3>
                                    <div className="flex items-center gap-2 text-xs opacity-60">
                                        <FileText size={12} /> {pages.find(p => p.id === ctrl.pageId)?.nom || "No Page"}
                                        <ArrowRight size={12} />
                                        <Settings size={12} /> {endpoints[ctrl.endpointIndex]?.nom || "No API"}
                                    </div>
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
                                        value={activeController?.pageId}
                                        onChange={(e) => updateController(selectedIndex, 'pageId', e.target.value)}
                                        className="w-full p-4 rounded-2xl border border-couleur1/10 bg-couleur3/30 outline-none focus:ring-2 ring-couleur1/20 transition-all"
                                    >
                                        {pages.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.uri})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2"><Settings size={14}/> API Endpoint</label>
                                    <select 
                                        value={activeController?.endpointIndex}
                                        onChange={(e) => updateController(selectedIndex, 'endpointIndex', parseInt(e.target.value))}
                                        className="w-full p-4 rounded-2xl border border-couleur1/10 bg-couleur3/30 outline-none focus:ring-2 ring-couleur1/20 transition-all"
                                    >
                                        {endpoints.map((ep, i) => <option key={i} value={i}>{ep.method} {ep.uri} ({ep.nom})</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Step 2: Parameter Mapping */}
                            {activeEndpoint && (
                                <div className="pt-8 border-t border-couleur1/10">
                                    <h3 className="text-sm font-black uppercase text-couleur1/40 mb-6 flex items-center gap-2">
                                        <LinkIcon size={16} /> Data Mapping Configuration
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* URI Params Mapping */}
                                        {activeEndpoint.params?.map(param => (
                                            <MappingRow 
                                                key={param} 
                                                label={param} 
                                                type="URL Parameter" 
                                                value={activeController.mappings[param]}
                                                onChange={(val) => {
                                                    const newMappings = { ...activeController.mappings, [param]: val };
                                                    updateController(selectedIndex, 'mappings', newMappings);
                                                }}
                                            />
                                        ))}

                                        {/* Body Fields Mapping (from associated models) */}
                                        {activeEndpoint.model?.map(m => m.champs?.map(f => (
                                            <MappingRow 
                                                key={`${m.nom}-${f.nom}`} 
                                                label={f.nom} 
                                                type={`Body (${m.nom})`}
                                                value={activeController.mappings[`${m.nom}.${f.nom}`]}
                                                onChange={(val) => {
                                                    const newMappings = { ...activeController.mappings, [`${m.nom}.${f.nom}`]: val };
                                                    updateController(selectedIndex, 'mappings', newMappings);
                                                }}
                                            />
                                        )))}
                                    </div>
                                </div>
                            )}
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

function MappingRow({ label, type, value, onChange }) {
    const [source, setSource] = useState(value?.type || 'static');
    const [val, setVal] = useState(value?.value || '');

    const handleInternalChange = (s, v) => {
        setSource(s);
        setVal(v);
        onChange({ type: s, value: v });
    };

    return (
        <div className="flex items-center gap-4 bg-couleur3/10 p-4 rounded-2xl border border-couleur1/5 group hover:border-couleur1/20 transition-all">
            <div className="w-1/3">
                <p className="text-sm font-bold text-couleur1">{label}</p>
                <p className="text-[10px] uppercase opacity-40 font-black">{type}</p>
            </div>
            <div className="flex-1 flex gap-2">
                <select 
                    value={source}
                    onChange={(e) => handleInternalChange(e.target.value, val)}
                    className="bg-white px-3 py-2 rounded-xl border border-couleur1/10 text-xs font-bold outline-none"
                >
                    <option value="static">Static Value</option>
                    <option value="query">URL Query Param</option>
                    <option value="state">Page State</option>
                </select>
                <input 
                    type="text"
                    placeholder={source === 'static' ? "Enter value..." : "Param name..."}
                    value={val}
                    onChange={(e) => handleInternalChange(source, e.target.value)}
                    className="flex-1 bg-white px-4 py-2 rounded-xl border border-couleur1/10 text-sm outline-none focus:ring-2 ring-couleur1/20"
                />
            </div>
        </div>
    );
}
