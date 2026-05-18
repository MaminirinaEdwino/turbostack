import React, { useState, useEffect, useCallback } from "react";
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate } from "../../hooks/useNavigate"; // Import de useNavigate

import { GoApp } from "../../services/bridge";

// Import des composants de nœuds personnalisés
import NodeDbModel from "./NodeDbModel";
import NodeApiEndpoint from "./NodeApiEndpoint";
import NodeUIPage from "./NodeUIPage"; 
import NodeComponent from "./NodeComponent"; // New import
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, PanelsTopLeft, RefreshCcw, Save, Plus } from "lucide-react";

const nodeTypes = {
    dbModel: NodeDbModel,
    apiEndpoint: NodeApiEndpoint,
    uiPage: NodeUIPage,
    uiComponent: NodeComponent, // New node type
};

export default function UnifiedEditor({ projectName }) {
    const navigateTo = useNavigate(); // Initialisation du hook de navigation
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") setTimeout(() => setToast(null), 3000);
    };


    /**
     * Gère la suppression des liaisons (edges)
     * Met à jour l'objet projet en supprimant les relations logiques
     */
    const onEdgesDelete = useCallback(
        (deletedEdges) => {
            setProject((prev) => {
                if (!prev) return prev;
                const newProject = JSON.parse(JSON.stringify(prev));

                deletedEdges.forEach((edge) => {
                    const { source, target } = edge;

                    // CAS 1 : Suppression de la liaison Modèle -> API
                    if (source.startsWith("model-") && target.startsWith("api-")) {
                        const modelNom = source.replace("model-", "");
                        const apiNom = target.replace("api-", "");
                        const ep = newProject.rest_api?.endpoints?.find(e => e.nom === apiNom);

                        if (ep && ep.model) {
                            ep.model = ep.model.filter(m => m.nom !== modelNom);
                            showToast(`Lien vers le modèle ${modelNom} supprimé de l'API ${apiNom}`, "info");
                        }
                    }

                    // CAS 2 : Suppression de la liaison API -> Page UI
                    if (source.startsWith("api-") && target.startsWith("page-")) {
                        const apiNom = source.replace("api-", "");
                        const pageNom = target.replace("page-", "");
                        const typeKey = newProject.type === "static" ? "site_statique" : "web_app";

                        let controllers = newProject[typeKey]?.controllers || [];
                        let ctrlIdx = controllers.findIndex(c => c.page_nom === pageNom);

                        if (ctrlIdx !== -1) {
                            controllers[ctrlIdx].bindings = (controllers[ctrlIdx].bindings || [])
                                .filter(b => b.endpoint_nom !== apiNom);
                            showToast(`Liaison API ${apiNom} retirée de la page ${pageNom}`, "info");
                        }
                    }
                });

                return newProject;
            });
        },
        [showToast]
    );


    const onConnect = useCallback(
        (params) => {
            const { source, target } = params;
            let edgeStyle = {};
            let markerColor = "";

            // Définition du style visuel selon le type de connexion
            if (source.startsWith("model-") && target.startsWith("api-")) {
                edgeStyle = { stroke: '#8b5cf6' };
                markerColor = '#8b5cf6';
            } else if (source.startsWith("api-") && target.startsWith("page-")) {
                edgeStyle = { stroke: '#10b981' };
                markerColor = '#10b981';
            }

            // Ajout visuel de l'arête
            setEdges((eds) => addEdge({
                ...params,
                animated: true,
                style: edgeStyle,
                markerEnd: { type: MarkerType.ArrowClosed, color: markerColor }
            }, eds));

            // Logique métier : Mise à jour du projet
            setProject((prev) => {
                if (!prev) return prev;
                const newProject = JSON.parse(JSON.stringify(prev));

                // CAS 1 : Modèle -> API
                if (source.startsWith("model-") && target.startsWith("api-")) {
                    const modelNom = source.replace("model-", "");
                    const apiNom = target.replace("api-", "");
                    const model = newProject.bdd?.models?.find(m => m.nom === modelNom);
                    const ep = newProject.rest_api?.endpoints?.find(e => e.nom === apiNom);

                    if (model && ep) {
                        if (!ep.model) ep.model = [];
                        if (!ep.model.some(m => m.nom === modelNom)) {
                            ep.model.push(model);
                            showToast(`Modèle ${modelNom} lié à l'API ${apiNom}`);
                        }
                    }
                }

                // CAS 2 : API -> Page UI
                if (source.startsWith("api-") && target.startsWith("page-")) {
                    const apiNom = source.replace("api-", "");
                    const pageNom = target.replace("page-", "");
                    const typeKey = newProject.type === "static" ? "site_statique" : "web_app";

                    let controllers = newProject[typeKey].controllers || [];
                    let ctrlIdx = controllers.findIndex(c => c.page_nom === pageNom);
                    const newBinding = { id_element: "root", endpoint_nom: apiNom, trigger: "onLoad", action: "fill_content", map_field: "data" };

                    if (ctrlIdx === -1) {
                        controllers.push({ nom: `Ctrl_${pageNom}`, page_nom: pageNom, bindings: [newBinding] });
                    } else {
                        controllers[ctrlIdx].bindings = [...(controllers[ctrlIdx].bindings || []), newBinding];
                    }
                    newProject[typeKey].controllers = controllers;
                    showToast(`API ${apiNom} liée à la page ${pageNom}`);
                }

                return newProject;
            });
        },
        [setEdges, showToast]
    );

    /**
     * Ajoute une nouvelle table (Modèle BDD) au projet
     */
    const handleAddTable = () => {
        const tableName = window.prompt("Nom de la nouvelle table :");
        if (!tableName) return;

        setProject((prev) => {
            if (!prev) return prev;

            // Vérification de l'existence
            if (prev.bdd?.models?.some(m => m.nom.toLowerCase() === tableName.toLowerCase())) {
                showToast("Cette table existe déjà", "error");
                return prev;
            }

            const newModel = {
                nom: tableName,
                champs: [
                    { nom: "id", type: "int", constraint: ["primary key", "autoincrement"] }
                ]
            };

            const updatedProject = {
                ...prev,
                bdd: {
                    ...prev.bdd,
                    models: [...(prev.bdd?.models || []), newModel]
                }
            };

            showToast(`Table ${tableName} créée`);
            return updatedProject;
        });
    };

    /**
     * Ajoute un nouvel endpoint API au projet
     */
    const handleAddEndpoint = () => {
        const name = window.prompt("Nom de l'endpoint API :");
        if (!name) return;

        setProject(prev => {
            if (!prev) return prev;
            if (prev.rest_api?.endpoints?.some(e => e.nom === name)) {
                showToast("Cet endpoint existe déjà", "error");
                return prev;
            }

            const newEp = { 
                nom: name, 
                uri: `/${name.toLowerCase().replace(/\s/g, '-')}`, 
                method: "GET", 
                role: "public", 
                model: [],
                params: [],
                manual_fields: []
            };

            const updatedProject = {
                ...prev,
                rest_api: {
                    ...prev.rest_api,
                    endpoints: [...(prev.rest_api.endpoints || []), newEp]
                }
            };
            showToast(`Endpoint ${name} créé`);
            return updatedProject;
        });
    };

    /**
     * Ajoute une nouvelle page au projet
     */
    const handleAddPage = () => {
        const name = window.prompt("Nom de la page UI :");
        if (!name) return;

        setProject(prev => {
            if (!prev) return prev;
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            
            if (prev[typeKey]?.pages?.some(p => p.nom === name)) {
                showToast("Cette page existe déjà", "error");
                return prev;
            }

            const newPage = {
                id: Math.random().toString(36).substr(2, 9),
                nom: name,
                uri: `/${name.toLowerCase().replace(/\s/g, '-')}`,
                content: []
            };

            const updatedProject = {
                ...prev,
                [typeKey]: {
                    ...prev[typeKey],
                    pages: [...(prev[typeKey].pages || []), newPage]
                }
            };
            showToast(`Page ${name} créée`);
            return updatedProject;
        });
    };

    /**
     * Ajoute un nouveau composant au projet
     */
    const handleAddComponent = () => {
        const name = window.prompt("Nom du composant UI :");
        if (!name) return;

        setProject(prev => {
            if (!prev) return prev;
            const typeKey = prev.type === "static" ? "site_statique" : "web_app";
            const compKey = prev[typeKey]?.composants ? "composants" : "composant";

            if (prev[typeKey]?.[compKey]?.some(c => c.nom === name)) {
                showToast("Ce composant existe déjà", "error");
                return prev;
            }

            const newComp = {
                id: Math.random().toString(36).substr(2, 9),
                nom: name,
                content: []
            };

            const updatedProject = {
                ...prev,
                [typeKey]: {
                    ...prev[typeKey],
                    [compKey]: [...(prev[typeKey][compKey] || []), newComp]
                }
            };
            showToast(`Composant ${name} créé`);
            return updatedProject;
        });
    };

    /**
     * Transforme l'objet projet en nœuds et liens pour React Flow
     * Cette fonction est appelée à chaque fois que l'état 'project' change
     */
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const refreshFlowLayout = useCallback(() => {
        if (!project) return;

        const newNodes = [];
        const newEdges = [];

        // Configuration de la disposition
        const colWidth = 350;
        const rowHeight = 180;

        // 1. Génération des Modèles de BDD (Colonne 1)
        const models = project.bdd?.models || [];
        models.forEach((model, idx) => {
            newNodes.push({
                id: `model-${model.nom}`,
                type: 'dbModel',
                position: { x: 50, y: 100 + (idx * rowHeight) },
                data: { 
                    label: model.nom, 
                    fields: model.champs, 
                    description: "Table",
                    onEdit: () => navigateTo('db_editor')
                }
            });
        });

        // 2. Génération des Endpoints API (Colonne 2)
        const endpoints = project.rest_api?.endpoints || [];
        endpoints.forEach((ep, idx) => {
            newNodes.push({
                id: `api-${ep.nom}`,
                type: 'apiEndpoint',
                position: { x: 50 + colWidth, y: 100 + (idx * rowHeight) },
                data: { 
                    ...ep, 
                    label: ep.nom,
                    onEdit: () => navigateTo('api_editor')
                }
            });

            // Liens API -> Modèles
            ep.model?.forEach(m => {
                newEdges.push({
                    id: `edge-api-model-${ep.nom}-${m.nom}`,
                    source: `model-${m.nom}`,
                    target: `api-${ep.nom}`,
                    animated: true,
                    style: { stroke: '#8b5cf6' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
                });
            });
        });

        // 3. Génération des Pages UI (Colonne 3)
        const siteData = project.type === "static" ? project.site_statique : project.web_app;
        const pages = siteData?.pages || [];
        pages.forEach((page, idx) => {
            newNodes.push({
                id: `page-${page.nom}`,
                type: 'uiPage',
                position: { x: 50 + (colWidth * 2), y: 100 + (idx * rowHeight) },
                data: { 
                    label: page.nom, 
                    uri: page.uri, 
                    boundEndpoints: [],
                    onEdit: () => navigateTo('page_editor'),
                    onEditLogic: () => navigateTo('controller_editor')
                }
            });
        });

        // 4. Liaisons via Controllers (Edges API -> UI)
        const controllers = siteData?.controllers || [];
        controllers.forEach(ctrl => {
            ctrl.bindings?.forEach(bind => {
                const edgeId = `edge-ui-api-${ctrl.page_nom}-${bind.endpoint_nom}`;
                // Éviter les doublons de liens visuels si plusieurs champs sont liés au même endpoint
                if (!newEdges.some(e => e.id === edgeId)) {
                    newEdges.push({
                        id: edgeId,
                        source: `api-${bind.endpoint_nom}`,
                        target: `page-${ctrl.page_nom}`,
                        label: bind.trigger,
                        animated: true,
                        style: { stroke: '#10b981' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
                    });
                }

                // Mise à jour des data du noeud page pour afficher les APIs liées dans la liste
                const pageNode = newNodes.find(n => n.id === `page-${ctrl.page_nom}`);
                if (pageNode && !pageNode.data.boundEndpoints.includes(bind.endpoint_nom)) {
                    pageNode.data.boundEndpoints.push(bind.endpoint_nom);
                }
            });
        });

        // 5. Génération des Composants UI (Colonne 4)
        const allComponents = [
            ...(project.web_app?.composant || []), // Note: 'composant' for web_app
            ...(project.site_statique?.composants || []) // Note: 'composants' for site_statique
        ];
        allComponents.forEach((comp, idx) => {
            const componentId = `comp-${comp.nom}`;
            newNodes.push({
                id: componentId,
                type: 'uiComponent',
                position: { x: 50 + (colWidth * 3), y: 100 + (idx * rowHeight) },
                data: { 
                    label: comp.nom, 
                    description: 'UI Component',
                    onEdit: () => navigateTo('page_editor')
                }
            });

            // Vérifier si le composant a été généré à partir d'un endpoint
            if (comp.nom.startsWith("Comp_")) {
                const endpointNom = comp.nom.substring(5); // "Comp_EndpointName" -> "EndpointName"
                newEdges.push({
                    id: `e-api-${endpointNom}-comp-${comp.nom}`,
                    source: `api-${endpointNom}`,
                    target: componentId,
                    type: 'smoothstep',
                    animated: true,
                    label: 'generates',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#FFD700' }, // Gold color for component generation
                });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project, setNodes, setEdges]);

    const handleNodeClick = useCallback((event, node) => {
        showToast(`Édition de ${node.type.replace('dbModel', 'Modèle DB').replace('apiEndpoint', 'Endpoint API').replace('uiPage', 'Page UI').replace('uiComponent', 'Composant UI')} "${node.data.label}"... (Fonctionnalité d'édition directe à venir)`, "info");
        // Ici, dans une version plus avancée, vous navigueriez vers l'éditeur spécifique
        // Par exemple : if (node.type === 'dbModel') navigateTo(`db_editor?model=${node.data.label}`);
    }, [showToast]);

    // Chargement initial du projet
    const loadProjectData = useCallback(async () => {
        setLoading(true);
        const res = await GoApp.fetchProjectByName(projectName);
        if (res) setProject(res);
        setLoading(false);
    }, [projectName]);

    const handleSave = async () => {
        if (!project) return;

        showToast("Sauvegarde du projet...", "loading");
        try {
            console.log("save")
            // On utilise la même méthode que les autres éditeurs pour la cohérence
            const result = await GoApp.saveProject(projectName, JSON.stringify(project));
            console.log(result)
            if (result === "Success" || !result || result === true) {
                showToast("Projet sauvegardé avec succès !");
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            showToast("Erreur lors de la sauvegarde", "error");
        }
    };

    useEffect(() => {
        loadProjectData();
    }, [loadProjectData]);

    // Met à jour le graphique dès que le projet change (ajout table, liaison, etc.)
    useEffect(() => {
        refreshFlowLayout();
    }, [refreshFlowLayout]);

    return (
        <div className="flex flex-col w-full h-screen bg-couleur3 dark:bg-gray-950 overflow-hidden">
            <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-couleur1/10 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-couleur1 text-white rounded-xl shadow-lg shadow-couleur1/20">
                        <PanelsTopLeft size={20} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <h1 className="text-sm font-black uppercase tracking-tight text-couleur1">Visual Workspace</h1>
                        <span className="text-[10px] font-bold opacity-40 italic">{projectName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Bouton pour revenir au tableau de bord */}
                    <button
                        onClick={() => navigateTo("Dashboard")}
                        className="p-2 text-couleur1/40 hover:text-couleur1 transition-colors"
                        title="Retour au Tableau de Bord"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    {/* Bouton pour recharger la disposition du projet */}
                    <button onClick={loadProjectData} className="p-2 text-couleur1/40 hover:text-couleur1 transition-colors" title="Recharger la disposition">
                        <RefreshCcw size={18} />
                    </button>
                    {/* Bouton pour ajouter une table */}
                    <button
                        onClick={handleAddTable}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-couleur1 border border-couleur1/20 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-couleur3 transition-all"
                    >
                        <Plus size={16} /> Add Table
                    </button>
                    {/* Bouton pour ajouter un endpoint API */}
                    <button
                        onClick={handleAddEndpoint}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-couleur1 border border-couleur1/20 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-couleur3 transition-all"
                    >
                        <Plus size={16} /> Add API
                    </button>
                    {/* Bouton pour ajouter une page UI */}
                    <button
                        onClick={handleAddPage}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-couleur1 border border-couleur1/20 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-couleur3 transition-all"
                    >
                        <Plus size={16} /> Add Page
                    </button>
                    {/* Bouton pour ajouter un composant UI */}
                    <button
                        onClick={handleAddComponent}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-couleur1 border border-couleur1/20 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-couleur3 transition-all"
                    >
                        <Plus size={16} /> Add Component
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-couleur1 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all"
                    >
                        <Save size={16} /> Sauvegarder
                    </button>
                </div>
            </header>

            <div className="flex-1 relative bg-gray-50 dark:bg-black/20">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-couleur1" size={32} />
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        onEdgesDelete={onEdgesDelete}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background variant="dots" gap={20} size={1} />
                        <Controls />
                        <MiniMap nodeStrokeWidth={3} zoomable pannable />
                    </ReactFlow>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-10 right-10 z-100 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 border ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
                    toast.type === "loading" ? "bg-blue-50 border-blue-200 text-blue-700" :
                        "bg-green-50 border-green-200 text-green-700"
                    }`}>
                    {toast.type === "loading" ? <Loader2 size={18} className="animate-spin" /> :
                        toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
}