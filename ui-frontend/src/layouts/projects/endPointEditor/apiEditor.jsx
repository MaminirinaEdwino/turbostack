import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "../../../hooks/useNavigate"
import { useSelector } from "react-redux"
import { GoApp } from "../../../services/bridge"
import { applyNodeChanges, Background, Controls, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import EndpointNode from "./endpointNode";
import NewEndpoint from "./newEndpoint";
import EditEndpoint from "./editEndpoint";
import GenerateCrud from "./generateCrud";
import { FcPrevious } from "react-icons/fc";
import { Plus, Save, CheckCircle, Loader2, AlertCircle, LayoutGrid, Layers, MoreVertical } from "lucide-react";

const nodeType = { "endpoint": EndpointNode }

export default function ApiEditor({ projectName }) {
    const navigateTo = useNavigate()
    const isDarkMode = useSelector((state) => state.app.darkMode);
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState([]);
    const [toggleModal, setToggleModal] = useState("none");
    const [toggleEditModal, setToggleEditModal] = useState("none");
    const [toggleCrudModal, setToggleCrudModal] = useState("none");
    const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(null);
    const [toast, setToast] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onNodesChange = useCallback(
        (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
        [],
    );



    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            if (res) {
                setProject(res)
            }
        }
        if (!project) loadProject()
    }, [projectName])

    const deleteEndpoint = useCallback((index) => {
        setProject(prev => {
            const newEndpoints = [...(prev.rest_api?.endpoints || [])]
            newEndpoints.splice(index, 1)
            return {
                ...prev,
                rest_api: { ...prev.rest_api, endpoints: newEndpoints }
            }
        });
        setToggleEditModal("none");
    }, []);

    const handleEditEndpoint = useCallback((index) => {
        setSelectedEndpointIndex(index);
        setToggleEditModal("block");
        setToggleModal("none");
    }, []);

    useEffect(() => {
        const setter = (updatedNodes)=>{
            setNodes(updatedNodes);
        }
        if (project && project.rest_api?.endpoints) {
            const updatedNodes = project.rest_api.endpoints.map((ep, index) => ({
                id: `ep-${index}`,
                type: "endpoint",
                position: nodes[index]?.position || { x: (index % 5) * 300, y: Math.floor(index / 5) * 200 },
                data: {
                    ...ep,
                    onDelete: () => deleteEndpoint(index),
                    onEdit: () => handleEditEndpoint(index)
                }
            }));
            setter(updatedNodes);
        }
        console.log("api ",JSON.stringify(project))
    }, [project]); // Added nodes to dependency array

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        if (type !== "loading") {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const reorganizeNodes = () => {
        setNodes((prevNodes) =>
            prevNodes.map((node, index) => ({
                ...node,
                position: { x: (index % 5) * 300, y: Math.floor(index / 5) * 200 }
            }))
        );
    };

    const saveApi = async () => {
        showToast("Sauvegarde en cours...", "loading");
        try {
            await GoApp.saveProject(projectName, JSON.stringify(project));
            showToast("API saved successfully !");
        } catch (error) {
            showToast("Erreur lors de la sauvegarde", error);
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Sauvegarde (Ctrl+S)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                saveApi();
            }
            // Retour ou fermeture de modale (Escape)
            if (e.key === 'Escape') {
                if (toggleModal !== "none" || toggleEditModal !== "none" || toggleCrudModal !== "none") {
                    setToggleModal("none");
                    setToggleEditModal("none");
                    setToggleCrudModal("none");
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
    }, [project, toggleModal, toggleEditModal, toggleCrudModal, saveApi, reorganizeNodes, navigateTo]);

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
            <div className="p-2 m-2 h-fit flex items-center justify-between">
                <div>
                    <h1 className="text-couleur1 dark:text-gray-100 text-3xl font-semibold flex items-center gap-2">
                        <button className="mx-2 px-2 py-2 rounded border cursor-pointer border-couleur1 dark:border-white/20 bg-couleur5 dark:bg-gray-800 text-couleur1 dark:text-gray-100" onClick={() => navigateTo("Dashboard")}>
                            <FcPrevious size={20} />
                        </button>
                        API Editor : {projectName}
                    </h1>
                </div>
                <div className="flex items-center gap-2 relative">
                    <button className="flex gap-2 text-white bg-couleur1 rounded px-6 py-2 font-bold hover:bg-opacity-90 transition-all shadow-sm items-center" onClick={saveApi}>
                        <Save size={18} /> Save API
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-couleur1 dark:text-gray-200 border border-couleur1 dark:border-white/20 rounded-lg hover:bg-couleur1/5 transition-all"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-couleur1/10 dark:border-white/10 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button 
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 transition-all"
                                        onClick={() => { reorganizeNodes(); setIsMenuOpen(false); }}
                                    >
                                        <LayoutGrid size={18} className="text-couleur1" /> Reorganize Layout
                                    </button>
                                    <button 
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 transition-all"
                                        onClick={() => { setToggleCrudModal("block"); setIsMenuOpen(false); }}
                                    >
                                        <Layers size={18} className="text-couleur1" /> Auto CRUD
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
                                    <button 
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-couleur1 hover:bg-couleur1/10 transition-all"
                                        onClick={() => { setToggleModal("block"); setIsMenuOpen(false); }}
                                    >
                                        <Plus size={18} /> Add Endpoint
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de création */}
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
                {project && (
                    <NewEndpoint
                        project={project}
                        setProject={setProject}
                        setToggle={setToggleModal}
                    />
                )}
            </div>

            {/* Modal de modification */}
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleEditModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
                {selectedEndpointIndex !== null && project && (
                    <EditEndpoint
                        index={selectedEndpointIndex}
                        project={project}
                        setProject={setProject}
                        setToggle={setToggleEditModal}
                    />
                )}
            </div>

            {/* Modal de génération CRUD */}
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleCrudModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}>
                {project && (
                    <GenerateCrud
                        project={project}
                        setProject={setProject}
                        setToggle={setToggleCrudModal}
                    />
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${
                    toast.type === "error" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" :
                    toast.type === "loading" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" :
                    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                }`}>
                    {toast.type === "loading" ? <Loader2 size={18} className="animate-spin" /> : 
                     toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            <div className="w-auto h-full bg-white dark:bg-gray-900 m-5 rounded border border-couleur1 dark:border-white/10">
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    nodeTypes={nodeType}
                    fitView
                    colorMode={isDarkMode ? 'dark' : 'light'}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    )
}