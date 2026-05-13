import { useCallback, useEffect, useState } from "react"
import { useNavigateProject } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { addEdge, applyEdgeChanges, Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import DbModel from "./dbModel";


const initialNodes = [
    {
        id: "model-1",
        type: "model",
        position: { x: 0, y: 0},
        data: {
            "nom": "model de base",
            "champs": [
                "champs 1",
                "champs 2",
                "champs 3",
                "champs 4",
                "champs 5",
            ]
        }
    },
];
const nodeType = {"model": DbModel}
const initialEdges = [];
export default function DbEditor({ projectName }) {
    const navigateTo = useNavigateProject()
    const [project, setProject] = useState(null)
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

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
            setProject(res)
        }
        if (project == null) {
            loadProject()

        }
    }, [projectName])
    return <div className="flex w-screen h-screen flex-col">
        <div className=" p-2 m-2 h-fit">
            <h1 className="text-couleur1 text-3xl font-semibold">DB Editor </h1>
            <button title="go back" onClick={() => navigateTo(projectName)}>Project {projectName}</button>
            {project != null && project.bdd != null && "bdd"}
        </div>
        <div className="w-auto h-full">
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