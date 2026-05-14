import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { applyNodeChanges, Background, Controls, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import EndpointNode from "./endpointNode";
import NewEndpoint from "./newEndpoint";
import EditEndpoint from "./editEndpoint";
import { FcPrevious } from "react-icons/fc";
import { Plus, Save } from "lucide-react";

const nodeType = { "endpoint": EndpointNode }

export default function ApiEditor({ projectName }) {
    const navigateTo = useNavigate()
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState([]);
    const [toggleModal, setToggleModal] = useState("none");
    const [toggleEditModal, setToggleEditModal] = useState("none");
    const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(null);

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
                position: nodes[index]?.position || { x: index * 300, y: 50 },
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

    const saveApi = async () => {
        await GoApp.saveProject(projectName, JSON.stringify(project))
    }

    return (
        <div className="flex w-screen h-screen flex-col bg-couleur3">
            <div className="p-2 m-2 h-fit flex items-center justify-between">
                <div>
                    <h1 className="text-couleur1 text-3xl font-semibold flex items-center gap-2">
                        <button className="mx-2 px-2 py-2 rounded border cursor-pointer border-couleur1 bg-couleur5" onClick={() => navigateTo("Dashboard")}>
                            <FcPrevious size={20} />
                        </button>
                        API Editor : {projectName}
                    </h1>
                </div>
                <div className="flex ">
                    <button className="flex gap-2 text-couleur1 border border-couleur1 rounded px-4 py-1 m-2" onClick={() => setToggleModal("block")}>
                        <Plus /> Add Endpoint
                    </button>
                    <button className="flex gap-2 text-white bg-couleur1 rounded px-4 py-1 m-2" onClick={saveApi}>
                        <Save /> Save API
                    </button>
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

            <div className="w-auto h-full bg-white m-5 rounded border border-couleur1">
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    nodeTypes={nodeType}
                    fitView
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    )
}