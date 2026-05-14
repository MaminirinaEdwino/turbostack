import { useCallback, useEffect, useState } from "react"
import { useNavigateProject } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { addEdge, applyEdgeChanges, Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import DbModel from "./dbModel";
import NewModel from "./newModel";
import { BsBack } from "react-icons/bs";
import { FcPrevious } from "react-icons/fc";
import { Plus } from "lucide-react";


const initialNodes = [

];
const nodeType = { "model": DbModel }
const initialEdges = [];
export default function DbEditor({ projectName }) {
    const navigateTo = useNavigateProject()
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [toggleModal, setToggleModal] = useState("none");
    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyEdgeChanges(changes, nodesSnapshot)),
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
    useEffect(() => {
        const reloadNode = () => {
            setNodes([...nodes, {
                    id: "model-" + (project.models.length-1),
                    type: "model",
                    position: { x: 0, y: 0 },
                    data: {
                        "nom": project.models[project.models.length-1].nom,
                        "champs": [...project.models[project.models.length-1].champs]
                    }
                }])
        }
        if (project != null && project.models != null) {
            if (nodes.length < project.models.length) {
                reloadNode()
            }
        }
        
    }, [project])
    const handleNewModelModal = ()=>{
            if (toggleModal == "none") {
                setToggleModal("block")
            }else{
                setToggleModal("none")
            }
        }
    return <div className="flex w-screen h-screen flex-col bg-couleur3">
        <div className=" p-2 m-2 h-fit flex items-center justify-between">
            <div>
                <h1 className="text-couleur1 text-3xl font-semibold"> <button className="mx-2 px-2 py-2 rounded border cursor-pointer border-couleur1 bg-couleur5" title="go back" onClick={() => navigateTo(projectName)}><FcPrevious size={20}></FcPrevious></button>DB Editor : {projectName}</h1>
            </div>
            <button className="flex gap-2 text-couleur1 border border-couleur1 rounded px-4 py-1 m-2" onClick={handleNewModelModal}><Plus></Plus> Add Table</button>
        </div>
        
        <div style={{display: toggleModal}} className="fixed top-20 z-10">
            <NewModel setModelList={setProject} modelList={project} setToggle={setToggleModal}></NewModel>
        </div>
        <div className="w-auto h-full bg-white m-5 rounded border border-couleur1">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeType}
            >
                <Controls />
                {/* <MiniMap /> */}
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    </div>
}