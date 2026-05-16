import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import DbModel from "./dbModel";
import NewModel from "./newModel";
import EditModel from "./editModel";
import GenerateUserTable from "./generateUserTable";
import { FcPrevious } from "react-icons/fc";
import { Plus, Save, CheckCircle, Loader2, AlertCircle, LayoutGrid, User, MoreVertical } from "lucide-react";


const initialNodes = [];
const nodeType = { "model": DbModel }
const initialEdges = [];
export default function DbEditor({ projectName }) {
    const navigateTo = useNavigate()
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [toggleModal, setToggleModal] = useState("none");
    const [toggleEditModal, setToggleEditModal] = useState("none");
    const [toggleUserModal, setToggleUserModal] = useState("none");
    const [selectedModelIndex, setSelectedModelIndex] = useState(null);
    const [toast, setToast] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            setProject(res.bdd)
        }
        if (project == null) {
            loadProject()

        }
    }, [projectName])
    // const nodeExist = (id) => {
    //     return nodes.some((item) => item.id == "model-" + id)
    // }
    const deleteModel = useCallback((name) => {
        const nodeId = "model-" + name;
        setProject(prev => ({
            ...prev,
            models: prev.models.filter(m => m.nom !== name)
        }));
        setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        setToggleEditModal("none");
    }, []);

    const handleEditModel = useCallback((index) => {
        setSelectedModelIndex(index);
        setToggleEditModal("block");
        setToggleModal("none"); // Ferme le modal de création si ouvert
    }, []);

    useEffect(() => {
        const setter = (updatedNodes) => {
            setNodes(updatedNodes);
        }
        const edgeSetter = (newEdges)=>{
            setEdges(newEdges)
        }
        if (project != null && project.models != null) {
            const updatedNodes = project.models.map((model, index) => {
                if (model && Object.keys(model).length > 0) {
                    const nodeId = "model-" + model.nom;
                    const existingNode = nodes.find(n => n.id === nodeId);

                    return {
                        id: nodeId,
                        type: "model",
                        position: existingNode ? existingNode.position : { x: (index % 3) * 350, y: Math.floor(index / 3) * 300 },
                        data: {
                            "nom": model.nom,
                            "champs": [...model.champs],
                            "onDelete": () => deleteModel(model.nom),
                            "onEdit": () => handleEditModel(index)
                        }
                    };
                }
                return null;
            }).filter(Boolean);
            setter(updatedNodes)

            // Generate edges based on relations
            const newEdges = [];
            project.models.forEach(model => {
                const sourceId = "model-" + model.nom;
                (model.champs || []).forEach(field => {
                    const constraints = Array.isArray(field.constraint) ? field.constraint : [];
                    constraints.forEach(c => {
                        if (typeof c === 'string' && c.startsWith('relation:')) {
                            const targetTable = c.split(':')[1].split('.')[0];
                            const targetId = "model-" + targetTable;

                            if (project.models.some(m => m.nom === targetTable)) {
                                newEdges.push({
                                    id: `edge-${sourceId}-${targetId}-${field.nom}`,
                                    source: sourceId,
                                    target: targetId,
                                    label: field.nom,
                                    animated: true,
                                    style: { stroke: '#4f46e5', strokeWidth: 2 },
                                });
                            }
                        }
                    });
                });
            });
            edgeSetter(newEdges);
        }
    }, [project, deleteModel]);

    const handleNewModelModal = () => {
        if (toggleModal == "none") {
            setToggleModal("block")
        } else {
            setToggleModal("none")
        }
    }

    const onNodeClick = useCallback((event, node) => {
        const index = project.models.findIndex(m => "model-" + m.nom === node.id);
        if (index !== -1) {
            setSelectedModelIndex(index);
            setToggleEditModal("block");
            setToggleModal("none"); // Ferme le modal de création si ouvert
        }
    }, [project]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const savedb = async () => {
        showToast("Sauvegarde en cours...", "loading");
        try {
            await GoApp.savedb(projectName, JSON.stringify(project));
            showToast("Database saved successfully !");
        } catch (error) {
            showToast("Erreur lors de la sauvegarde", error);
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reorganizeNodes = () => {
        setNodes((prevNodes) =>
            prevNodes.map((node, index) => ({
                ...node,
                position: { x: (index % 3) * 350, y: Math.floor(index / 3) * 300 }
            }))
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Sauvegarde (Ctrl+S)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                savedb();
            }
            // Retour ou fermeture de modale (Escape)
            if (e.key === 'Escape') {
                if (toggleModal !== "none" || toggleEditModal !== "none" || toggleUserModal !== "none") {
                    setToggleModal("none");
                    setToggleEditModal("none");
                    setToggleUserModal("none");
                } else {
                    navigateTo("Dashboard");
                }
            }
            // Réorganisation (Ctrl+Shift+L)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                reorganizeNodes();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [project, toggleModal, toggleEditModal, toggleUserModal, savedb, reorganizeNodes, navigateTo]);

    return <div className="flex w-screen h-screen flex-col bg-couleur3">
        <div className=" p-2 m-2 h-fit flex items-center justify-between">
            <div>
                <h1 className="text-couleur1 text-3xl font-semibold"> <button className="mx-2 px-2 py-2 rounded border cursor-pointer border-couleur1 bg-couleur5" title="go back" onClick={() => navigateTo("Dashboard")}><FcPrevious size={20}></FcPrevious></button>DB Editor : {projectName} </h1>
            </div>
            <div className="flex items-center gap-2 relative">
                <button className="flex gap-2 text-white bg-couleur1 rounded px-6 py-2 font-bold hover:bg-opacity-90 transition-all shadow-sm items-center" onClick={savedb}>
                    <Save size={18} /> Save
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-couleur1 border border-couleur1/20 rounded-lg hover:bg-couleur1/5 transition-all"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-couleur1/10 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button 
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 transition-all"
                                    onClick={() => { reorganizeNodes(); setIsMenuOpen(false); }}
                                >
                                    <LayoutGrid size={18} className="text-couleur1" /> Reorganize Layout
                                </button>
                                <button 
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 transition-all"
                                    onClick={() => { setToggleUserModal("block"); setIsMenuOpen(false); }}
                                >
                                    <User size={18} className="text-couleur1" /> Generate User Table
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
                                <button 
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-couleur1 hover:bg-couleur1/10 transition-all"
                                    onClick={() => { handleNewModelModal(); setIsMenuOpen(false); }}
                                >
                                    <Plus size={18} /> Add New Table
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
            <NewModel setModelList={setProject} modelList={project} setToggle={setToggleModal}></NewModel>
        </div>
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleUserModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
            <GenerateUserTable setModelList={setProject} modelList={project} setToggle={setToggleUserModal}></GenerateUserTable>
        </div>
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 ease-out transform ${toggleEditModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
            {selectedModelIndex !== null && <EditModel setModelList={setProject} modelList={project} setToggle={setToggleEditModal} index={selectedModelIndex}></EditModel>}
        </div>

        {/* Toast Notification */}
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

        <div className="w-auto h-full bg-white m-5 rounded border border-couleur1">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                nodeTypes={nodeType}
            >
                <Controls />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    </div>
}