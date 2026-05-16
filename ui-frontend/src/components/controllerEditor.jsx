import { useState, useEffect } from "react";
import { 
    Save, Plus, Edit3, Trash2, Loader2, Cpu, FileText, 
    CheckCircle, AlertCircle, Link as LinkIcon, Database, ChevronDown, ChevronRight
} from "lucide-react";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../hooks/useNavigate";
import { GoApp } from "../services/bridge";
import ControllerEditorHeader from "./controllerEditor/controllerEditorHeader";
import NewController from "./controllerEditor/newController";

export default function ControllerEditor({ projectName }) {
    const navigateTo = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [toast, setToast] = useState(null);
    const [collapsedEndpoints, setCollapsedEndpoints] = useState({});

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
    
    const activeController = selectedIndex !== null ? controllers[selectedIndex] : null;
    const activeBindings = activeController?.bindings;

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

    const toggleGroup = (endpointNom) => {
        setCollapsedEndpoints(prev => ({
            ...prev,
            [endpointNom]: !prev[endpointNom]
        }));
    };

    const updateGroupConfig = (endpointNom, field, value) => {
        updateController(selectedIndex, 'bindings', (prev = []) => {
            return prev.map(b => b.endpoint_nom === endpointNom ? { ...b, [field]: value } : b);
        });
    };

    const toggleBinding = (endpointNom, fieldNom, isChecked) => {
        updateController(selectedIndex, 'bindings', (prev = []) => {
            if (isChecked) {
                const bestMatchId = availableIds.find(id => 
                    id.toLowerCase().includes(fieldNom.toLowerCase()) || 
                    fieldNom.toLowerCase().includes(id.toLowerCase())
                ) || (availableIds[0] || "root");

                const existingInGroup = prev.find(b => b.endpoint_nom === endpointNom);

                return [...prev, {
                    id_element: bestMatchId,
                    endpoint_nom: endpointNom,
                    trigger: existingInGroup?.trigger || "onLoad",
                    action: existingInGroup?.action || "fill_content",
                    map_field: fieldNom
                }];
            } else {
                return prev.filter(b => !(b.endpoint_nom === endpointNom && b.map_field === fieldNom));
            }
        });
    };

    const handleSave = async () => {
        showToast("Saving controllers...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("Controllers saved!");
        } catch (e) {
            console.error(e)
            showToast("Error saving", "error");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-couleur3"><Loader2 className="animate-spin text-couleur1" /></div>;

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
            {/* Header */}
            
            <ControllerEditorHeader editMode={editMode} handleSave={handleSave} navigateTo={navigateTo} projectName={projectName} setEditMode={setEditMode}></ControllerEditorHeader>
            <div className="flex-1 p-8 overflow-y-auto">
                {!editMode ? (
                    <div className="space-y-6">
                        <NewController pages={pages} setProject={setProject} typeKey={typeKey}></NewController>
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
                                        value={activeController?.page_nom || ""} // Assurez-vous que la valeur est une chaîne vide si null
                                        onChange={(e) => updateController(selectedIndex, 'page_nom', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                    >
                                        <option value="">Select a page...</option>
                                        {pages.map(p => <option key={p.nom} value={p.nom}>{p.nom} ({p.uri})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-couleur1/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black uppercase text-couleur1/40 flex items-center gap-2">
                                        <LinkIcon size={16} /> Data Bindings
                                    </h3>
                                    <span className="text-[10px] font-bold text-couleur1/30 italic">Select fields to bind to UI</span>
                                </div>
                                
                                <div className="space-y-12">
                                    {endpoints.map((ep) => {
                                        const bindingsInGroup = activeBindings?.filter(b => b.endpoint_nom === ep.nom) || [];
                                        const groupTrigger = bindingsInGroup[0]?.trigger || "onLoad";
                                        const groupAction = bindingsInGroup[0]?.action || "fill_content";

                                        return (
                                            <div key={ep.nom} className="space-y-4">
                                                <div 
                                                    className="flex items-center justify-between pb-2 border-b border-couleur1/5 cursor-pointer select-none group"
                                                    onClick={() => toggleGroup(ep.nom)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-couleur1/40 group-hover:text-couleur1 transition-colors">
                                                            {collapsedEndpoints[ep.nom] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                                        </div>
                                                        <Database size={14} className="text-couleur1/40" />
                                                        <span className="text-xs font-black uppercase text-couleur1 tracking-wider">{ep.nom}</span>
                                                        <span className="text-[9px] bg-couleur1/5 px-2 py-0.5 rounded text-couleur1/40">{ep.method} {ep.uri}</span>
                                                    </div>

                                                    {/* Configuration locale au groupe d'endpoint */}
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <select 
                                                            value={groupTrigger} 
                                                            onChange={(e) => updateGroupConfig(ep.nom, 'trigger', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                                        >
                                                            <option value="onLoad">onLoad</option>
                                                            <option value="onClick">onClick</option>
                                                            <option value="onHover">onHover</option>
                                                        </select>
                                                        <select 
                                                            value={groupAction} 
                                                            onChange={(e) => updateGroupConfig(ep.nom, 'action', e.target.value)}
                                                            className="w-full px-3 p-2 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                                        >
                                                            <option value="fill_content">Fill</option>
                                                            <option value="set_style">Style</option>
                                                            <option value="redirect">Redirect</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {!collapsedEndpoints[ep.nom] && (
                                                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {(() => {
                                                        const fields = [];
                                                        ep.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
                                                        ep.params?.forEach(p => fields.push(p));
                                                        const uniqueFields = [...new Set(fields)];
                                                        
                                                        return uniqueFields.map(fieldNom => {
                                                            const binding = activeController.bindings?.find(b => b.endpoint_nom === ep.nom && b.map_field === fieldNom);
                                                            return (
                                                                <FieldToggleRow 
                                                                    key={fieldNom}
                                                                    fieldNom={fieldNom}
                                                                    isActive={!!binding}
                                                                    binding={binding}
                                                                    onToggle={(checked) => toggleBinding(ep.nom, fieldNom, checked)}
                                                                    onChange={(newVal) => {
                                                                        updateController(selectedIndex, 'bindings', (prev) => {
                                                                            const idx = prev.findIndex(b => b.endpoint_nom === ep.nom && b.map_field === fieldNom);
                                                                            const next = [...prev];
                                                                            next[idx] = newVal;
                                                                            return next;
                                                                        });
                                                                    }}
                                                                />
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                                )}
                                            </div>
                                        );
                                    })}
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

function FieldToggleRow({ fieldNom, isActive, onToggle }) {
    return (
        <div className={`flex items-center justify-between p-2.5 px-4 rounded-xl border transition-all ${isActive ? 'bg-white shadow-sm border-couleur1/20' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}>
            {/* Checkbox et Nom du champ */}
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => onToggle(e.target.checked)}
                    className="w-3.5 h-3.5 accent-couleur1 cursor-pointer"
                />
                <span className={`text-xs font-bold ${isActive ? 'text-couleur1' : 'text-couleur1/60'}`}>{fieldNom}</span>
            </div>
        </div>
    );
}