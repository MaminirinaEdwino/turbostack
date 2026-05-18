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
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, PanelsTopLeft, RefreshCcw, Save } from "lucide-react";

const nodeTypes = {
    dbModel: NodeDbModel,
    apiEndpoint: NodeApiEndpoint,
    uiPage: NodeUIPage,
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



    const loadProjectLayout = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        const res = await GoApp.fetchProjectByName(projectName);
        if (!res) {
            setLoading(false);
            return;
        }
        setProject(res);
        const project = res;

        const newNodes = [];
        const newEdges = [];

        // Positions de base
        const colWidth = 350;
        const rowHeight = 180;

        // 1. Génération des Modèles de BDD (Colonne 1)
        const models = project.bdd?.models || [];
        models.forEach((model, idx) => {
            newNodes.push({
                id: `model-${model.nom}`,
                type: 'dbModel',
                position: { x: 50, y: 100 + (idx * rowHeight) },
                data: { label: model.nom, fields: model.champs, description: "Table" }
            });
        });

        // 2. Génération des Endpoints API (Colonne 2)
        const endpoints = project.rest_api?.endpoints || [];
        endpoints.forEach((ep, idx) => {
            newNodes.push({
                id: `api-${ep.nom}`,
                type: 'apiEndpoint',
                position: { x: 50 + colWidth, y: 100 + (idx * rowHeight) },
                data: { ...ep, label: ep.nom }
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
                data: { label: page.nom, uri: page.uri, boundEndpoints: [] }
            });
        });

        // 4. Liaisons via Controllers (Edges API -> UI)
        const controllers = siteData?.controllers || [];
        controllers.forEach(ctrl => {
            ctrl.bindings?.forEach(bind => {
                newEdges.push({
                    id: `edge-ui-api-${ctrl.page_nom}-${bind.endpoint_nom}`,
                    source: `api-${bind.endpoint_nom}`,
                    target: `page-${ctrl.page_nom}`,
                    label: bind.trigger,
                    style: { stroke: '#10b981' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
                });
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
        setLoading(false);
    }, [projectName, setNodes, setEdges]);

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
        const loader = () => {
            loadProjectLayout();
        }
        loader()
    }, [loadProjectLayout]);

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
                    <button onClick={loadProjectLayout} className="p-2 text-couleur1/40 hover:text-couleur1 transition-colors" title="Recharger la disposition">
                        <RefreshCcw size={18} />
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
                <div className={`fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 border ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
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