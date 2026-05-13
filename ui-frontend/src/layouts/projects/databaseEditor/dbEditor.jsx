import { useCallback, useEffect, useState } from "react"
import { useNavigateProject } from "../../../hooks/useNavigate"
import { GoApp } from "../../../services/bridge"
import { addEdge, applyEdgeChanges, Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import DbModel from "./dbModel";
import NewModel from "./newModel";


const initialNodes = [

];
const nodeType = { "model": DbModel }
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
            setProject(res.bdd)
        }
        if (project == null) {
            loadProject()

        }
    }, [projectName])
    useEffect(() => {
        const reloadNode = () => {
            // let tmp = nodes
            // for (let i = 0; i < project.models.length; i++) {
            //     tmp.push({
            //         id: "model-" + i,
            //         type: "model",
            //         position: { x: 0, y: 0 },
            //         data: {
            //             "nom": "model de base",
            //             "champs": [
            //                 "champs 1",
            //                 "champs 2",
            //                 "champs 3",
            //                 "champs 4",
            //                 "champs 5",
            //             ]
            //         }
            //     })
            // }
            // project.models[project.modesl.length-1]
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
    return <div className="flex w-screen h-screen flex-col">
        <div className=" p-2 m-2 h-fit">
            <h1 className="text-couleur1 text-3xl font-semibold">DB Editor </h1>
            <button title="go back" onClick={() => navigateTo(projectName)}>Project {projectName}</button>
            {project != null && project.models == null && "bdd model"}
        </div>
        <NewModel setModelList={setProject} modelList={project}></NewModel>
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