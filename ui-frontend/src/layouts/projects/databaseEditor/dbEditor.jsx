import { useCallback, useEffect, useState } from "react"
import { useNavigateProject } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import DbModel from "./dbModel";
import NewModel from "./newModel";
import EditModel from "./editModel";
import { FcPrevious } from "react-icons/fc";
import { Plus, Save } from "lucide-react";


const initialNodes = [];
const nodeType = { "model": DbModel }
const initialEdges = [];
export default function DbEditor({ projectName }) {
    const navigateTo = useNavigateProject()
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [toggleModal, setToggleModal] = useState("none");
    const [toggleEditModal, setToggleEditModal] = useState("none");
    const [selectedModelIndex, setSelectedModelIndex] = useState(null);
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
        if (project != null && project.models != null) {
            const updatedNodes = project.models.map((model, index) => {
                if (model && Object.keys(model).length > 0) {
                    const nodeId = "model-" + model.nom;
                    const existingNode = nodes.find(n => n.id === nodeId);

                    return {
                        id: nodeId,
                        type: "model",
                        position: existingNode ? existingNode.position : { x: index * 10, y: 50 },
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

    const savedb = async () => {
        await GoApp.savedb(projectName, JSON.stringify(project))
    }
    return <div className="flex w-screen h-screen flex-col bg-couleur3">
        <div className=" p-2 m-2 h-fit flex items-center justify-between">
            <div>
                <h1 className="text-couleur1 text-3xl font-semibold"> <button className="mx-2 px-2 py-2 rounded border cursor-pointer border-couleur1 bg-couleur5" title="go back" onClick={() => navigateTo(projectName)}><FcPrevious size={20}></FcPrevious></button>DB Editor : {projectName} </h1>
            </div>
            <div className="flex ">
                <button className="flex gap-2 text-couleur1 border border-couleur1 rounded px-4 py-1 m-2" onClick={handleNewModelModal}><Plus></Plus> Add Table</button>
                <button className="flex gap-2 text-white bg-couleur1  rounded px-4 py-1 m-2" onClick={savedb}><Save></Save>Save</button>
            </div>
        </div>

        <div className={`fixed top-20 z-10 transition-all duration-300 ease-out transform ${toggleModal === "block" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none invisible"}`}>
            <NewModel setModelList={setProject} modelList={project} setToggle={setToggleModal}></NewModel>
        </div>
        <div className={`fixed top-20 z-10 transition-all duration-300 ease-out transform ${toggleEditModal === "block" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none invisible"}`}>
            {selectedModelIndex !== null && <EditModel setModelList={setProject} modelList={project} setToggle={setToggleEditModal} index={selectedModelIndex}></EditModel>}
        </div>
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