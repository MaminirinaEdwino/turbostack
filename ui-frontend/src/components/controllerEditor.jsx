import { useState, useEffect } from "react";
import {
    Loader2,Link as LinkIcon, 
} from "lucide-react";
import { useNavigate } from "../hooks/useNavigate";
import { GoApp } from "../services/bridge";
import ControllerEditorHeader from "./controllerEditor/controllerEditorHeader";
import NewController from "./controllerEditor/newController";
import ControllerList from "./controllerEditor/controllerList";
import Toast from "./controllerEditor/toast";
import EndPointRender from "./controllerEditor/endPointRender";
import ControllerPageSelect from "./controllerEditor/controllerPageSelect";
import EditHeader from "./controllerEditor/editHeader";

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

    const generateComponentFromEndpoint = (endpointNom) => {
        const bindings = activeBindings?.filter(b => b.endpoint_nom === endpointNom) || [];
        if (bindings.length === 0) {
            showToast("Aucun champ mappé pour cet endpoint", "error");
            return;
        }

        const children = bindings.map(b => ({
            id: Math.random().toString(36).substr(2, 9),
            tag: "div",
            content: `<span class="font-semibold text-couleur1">${b.map_field}:</span> <span class="text-gray-600">{${b.map_field}}</span>`,
            className: "p-2 border-b border-couleur1/5 last:border-0",
            styles: "",
            children: []
        }));

        const newComponent = {
            id: Math.random().toString(36).substr(2, 9),
            nom: `Comp_${endpointNom}`,
            content: [{
                id: Math.random().toString(36).substr(2, 9),
                tag: "div",
                className: "p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-couleur1/10",
                content: `<h4 class="font-bold mb-3 text-couleur1 border-b border-couleur1/10 pb-2">${endpointNom} Template</h4>`,
                styles: "",
                children: children
            }],
            params: []
        };

        setProject(prev => {
            const k = prev.type === "static" ? "site_statique" : "web_app";
            const compKey = prev[k].composants ? "composants" : "composant";
            const currentComps = prev[k][compKey] || [];
            return { ...prev, [k]: { ...prev[k], [compKey]: [...currentComps, newComponent] } };
        });

        showToast(`Composant 'Comp_${endpointNom}' créé avec succès !`);
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
                        <ControllerList controllers={controllers} setEditMode={setEditMode} setProject={setProject} setSelectedIndex={setSelectedIndex} typeKey={typeKey} ></ControllerList>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-couleur1/10 shadow-2xl overflow-hidden">
                        <EditHeader activeController={activeController} selectedIndex={selectedIndex} setEditMode={setEditMode} updateController={updateController} ></EditHeader>

                        <div className="p-8 space-y-8">
                            <ControllerPageSelect activeController={activeController} pages={pages} selectedIndex={selectedIndex} updateController={updateController}></ControllerPageSelect>

                            <div className="pt-8 border-t border-couleur1/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black uppercase text-couleur1/40 flex items-center gap-2">
                                        <LinkIcon size={16} /> Data Bindings
                                    </h3>
                                    <span className="text-[10px] font-bold text-couleur1/30 italic">Select fields to bind to UI</span>
                                </div>

                                <EndPointRender 
                                    activeBindings={activeBindings} 
                                    activeController={activeController} 
                                    collapsedEndpoints={collapsedEndpoints} 
                                    endpoints={endpoints} 
                                    selectedIndex={selectedIndex} 
                                    toggleBinding={toggleBinding} 
                                    toggleGroup={toggleGroup} 
                                    updateController={updateController} 
                                    updateGroupConfig={updateGroupConfig}
                                    generateComponent={generateComponentFromEndpoint}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {toast && (
                <Toast toast={toast}></Toast>
            )}
        </div>
    );
}
