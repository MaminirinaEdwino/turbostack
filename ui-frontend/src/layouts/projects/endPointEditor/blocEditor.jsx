import { useState, useEffect, useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  ReactFlow,
  Controls,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Database, LogOut, PanelLeft, Plus, Puzzle, Save } from "lucide-react";
import RootNode from "./visualNode/rootNode";
import FunctionNode from "./visualNode/functionNode";
import VarNode from "./visualNode/varNode";
import SelectNode from "./visualNode/selectNode";
import WhereNode from "./visualNode/whereNode";
import ModelNode from "./visualNode/modelNode";
import BodyParamsNode from "./visualNode/bodyParamsNode";
import RequestParams from "./visualNode/requestParams";
import InsertNode from "./visualNode/insertNode";
import ReturnNode from "./visualNode/returnTypeNode";
import UpdateNode from "./visualNode/updateNode";
import DeleteNode from "./visualNode/deleteNode";
import ResponseNode from "./visualNode/responseNode";
import StatusCodeNode from "./visualNode/statusCodeNode";
import TryCatchNode from "./visualNode/tryCatchNode";
import IfNode from "./visualNode/ifNode";
import ElseNode from "./visualNode/elseNode";
import IfElseNode from "./visualNode/ifElseNode";
import ElseIfNode from "./visualNode/elseIfNode";
import { DifferentNode, EqualNode, InferiorNode, SuperiorNode } from "./visualNode/conditionNode";
import WhileNode from "./visualNode/whileNode";
import ForNode from "./visualNode/forNode";
import { GrReturn } from "react-icons/gr";
import { ReactFlowProvider } from "@xyflow/react";
import Toast from "../../../components/controllerEditor/toast";

// Déclaration des types de nœuds sur mesure
const nodeTypes = {
  rootNode: RootNode,
  functionNode: FunctionNode,
  varNode: VarNode,
  modelNode: ModelNode,
  selectNode: SelectNode,
  whereNode: WhereNode,
  bodyParamsNode: BodyParamsNode,
  requestParamsNode: RequestParams,
  insertNode: InsertNode,
  returnNode: ReturnNode,
  updateNode: UpdateNode,
  deleteNode: DeleteNode,
  responseNode: ResponseNode,
  statusCodeNode: StatusCodeNode,
  tryCatchNode: TryCatchNode,
  ifNode: IfNode,
  elseNode: ElseNode,
  ifElseNode: IfElseNode,
  elseIfNode: ElseIfNode,
  equalNode: EqualNode,
  differentNode: DifferentNode,
  superiorNode: SuperiorNode,
  inferiorNode: InferiorNode,
  whileNode: WhileNode,
  forNode: ForNode
};


// ==========================================
// COMPOSANT LOGIQUE DE TURBOSTACK
// ==========================================
export function FlowCanvas({ setProjet, endpoint, project, setToggleVisualScriptModal, colorMode }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [model, setModel] = useState([]);
  const [endPointModel, setEndPointModel] = useState([]);
  const { fitBounds } = useReactFlow()
  const focusOnNode = useCallback((nodePosition) => {
    requestAnimationFrame(() => {
      fitBounds({
        x: nodePosition.x,
        y: nodePosition.y,
        width: 250,
        height: 180,
      },
        {
          duration: 800,
          padding: 1.2
        }
      )
    })
  }, [fitBounds])
  const [openTab, setOpenTab] = useState(false)
  useEffect(() => {
    if (typeof (project) == "object" && endpoint != null) {
      let modelList = [];
      let endPointModelList = [];
      project?.rest_api.endpoints[endpoint].model.map((mdl) => {
        project?.bdd.models.map((mdl2) => {
          if (mdl2.nom == mdl.nom) {
            // console.log("same")
            modelList.push(mdl2);
            endPointModelList.push(mdl);
          }
        })
      })
      setModel(modelList)
      setEndPointModel(endPointModelList)
    }
  }, [endpoint, project])

  const isValidConnection = useCallback(
    (connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      // console.log(sourceNode, targetNode)
      if (!sourceNode || !targetNode) return false;
      if (sourceNode == targetNode) return false;
      if (connection.targetHandle && connection.targetHandle.startsWith("param-")) {
        if (connection.sourceHandle == "exec-source") {
          console.warn("connection non valide")
          return false;
        }
      }

      if (connection.targetHandle === "exec-target") {
        if (connection.SourceHandle && connection.sourceHandle.startsWith("param-")) {
          console.warn("connection non valide")
          return false;
        }
      }
      if (targetNode.type == "selectNode" && sourceNode.type != "modelNode")
        return false;
      const queryModifiers = ["whereNode", "joinNode"];
      if (queryModifiers.includes(targetNode.type)) {
        const validSources = ["selectNode", "whereNode", "joinNode", "requestParamsNode", "bodyParamsNode", "varNode"];
        if (!validSources.includes(sourceNode.type)) {
          console.warn(
            "Les blocs WHERE ou JOIN doivent suivre un bloc SELECT, WHERE ou JOIN !",
          );
          return false;
        }
      }
    },
    [nodes],
  );
  // FONCTION : Modifier un bloc à chaud
  const onNodeDataChange = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: newData } : node)),
    );
  }, []);

  // FONCTION : Supprimer un bloc d'instruction
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  }, []);
  const addChildAutomatically = useCallback(
    (parentId, childType, otherData) => {
      // const { selectedType } = otherData;
      setNodes((currentNodes) => {
        const parentNode = currentNodes.find((n) => n.id === parentId);
        if (!parentNode) return currentNodes;

        const childId = `${childType}_${Math.random().toString(36).substr(2, 5)}`;

        // Positionner le bloc enfant intelligemment à droite du parent
        const childPosition = {
          x: parentNode.position.x + 300,
          y: parentNode.position.y + ((currentNodes.length * 20) % 60), // Léger décalage pour éviter les superpositions si clics successifs
        };

        let blockData = {
          name: childType,
          onNodeDataChange,
          onDeleteNode,
          addChildAutomatically: parentNode.data.addChildAutomatically, // Permet le chaînage à l'infini (ex: dbModel -> select -> where)
          selectedType: otherData.selectedType && otherData.selectedType,
          model: otherData.model && otherData.model,
          parentType: otherData.parentType && otherData.parentType
        };

        // if (childType == "selectNode" && typeof(otherData) == "object") {
        //   console.log(typeof(otherData))
        //   blockData.data.selectedType = otherData.selectedType
        // }

        const newChildNode = {
          id: childId,
          type: childType,
          position: childPosition,
          data: blockData,
        };

        // Ajouter le lien immédiatement
        if (otherData.sourceHandle) {
          setEdges((currentEdges) => [
            ...currentEdges,
            { id: `e-${parentId}-${childId}`, source: parentId, target: childId, sourceHandle: otherData.sourceHandle, style: { stroke: "#4ecdc4" } },
          ]);
        } else {
          setEdges((currentEdges) => [
            ...currentEdges,
            { id: `e-${parentId}-${childId}`, source: parentId, target: childId, style: { stroke: "#4ecdc4" } },
          ]);
        }
        focusOnNode(childPosition)
        return [...currentNodes, newChildNode];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteNode, onNodeDataChange],
  );
  // Charger la structure de données de l'API
  useEffect(() => {

    if (endpoint != null && project.rest_api.endpoints[endpoint].logic != null) {
      // const { initialNodes, initialEdges } = flattenLogicTree(
      //   endpoint.logic.node,
      //   onNodeDataChange,
      //   onDeleteNode,
      //   addChildAutomatically,
      // );
      // setNodes(initialNodes);
      // setEdges(initialEdges);
      let initialNodes = [];
      // let initialEdges = [];
      JSON.parse(project.rest_api.endpoints[endpoint].logic.node).map((node) => {
        initialNodes.push({
          ...node,
          data: {
            ...node.data,
            onNodeDataChange,
            onDeleteNode,
            addChildAutomatically
          }
        })
      })
      console.log("teste")
      setNodes(initialNodes)
      setEdges(JSON.parse(project.rest_api.endpoints[endpoint].logic.edge))
      console.log(JSON.parse(project.rest_api.endpoints[endpoint].logic.node))
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [endpoint, onNodeDataChange, onDeleteNode, addChildAutomatically, project]);

  // FONCTION : Ajouter un nouveau bloc d'API depuis la barre latérale
  const addNewBlock = (type) => {
    const uniqueId = `${type}_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const newNode = {
      id: uniqueId,
      type: type === "function" ? "functionNode" : "varNode",
      position: basePosition,
      data: {
        name: type === "function" ? "GetUsersDB" : "userId",
        params: type === "function" ? "ctx" : "",
        type: "string",
        "default value": "",
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const addModelBlock = (name, modelInfo) => {
    const uniqueId = `modelNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const modelBlock = {
      id: uniqueId,
      type: "modelNode",
      position: basePosition,
      data: {
        name: name,
        model: modelInfo,
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    };

    setNodes((nds) => [...nds, modelBlock]);
  };

  const addRootBlock = () => {
    const uniqueid = `rootNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };
    const rootBlock = {
      id: uniqueid,
      type: "rootNode",
      position: basePosition,
      data: {
        name: "rootNode",
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically
      }
    }
    setNodes((nds) => [...nds, rootBlock]);
  }
  const addBodyParamsBlock = (bodyParams) => {
    const uniqueId = `bodyParams_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "bodyParamsNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
        bodyParams: bodyParams
      }
    }

    setNodes((nds) => [...nds, block]);
  }
  const addRequestParamsBlock = (requestParams) => {
    const uniqueId = `requestParams_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "requestParamsNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
        requestParams: requestParams
      }
    }

    focusOnNode(basePosition)

    setNodes((nds) => [...nds, block]);
  }

  const addResponseBlock = () => {
    const uniqueId = `responseNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "responseNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
        response: []
      }
    }

    setNodes((nds) => [...nds, block]);
  }

  const addTryCatchBlock = () => {
    const uniqueId = `tryCatchNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "tryCatchNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically
      }
    }

    setNodes((nds) => [...nds, block]);
  }
  const addWhileBlock = () => {
    const uniqueId = `whileNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "whileNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically
      }
    }

    setNodes((nds) => [...nds, block]);
  }

  const addForBlock = () => {
    const uniqueId = `forNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "forNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically
      }
    }

    setNodes((nds) => [...nds, block]);
  }
  const addConditionBlock = () => {
    const uniqueId = `ifElseNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "ifElseNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically
      }
    }

    setNodes((nds) => [...nds, block]);
  }

  const addStatusCodeBlock = () => {
    const uniqueId = `response_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const block = {
      id: uniqueId,
      type: "statusCodeNode",
      position: basePosition,
      data: {
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
        response: []
      }
    }

    setNodes((nds) => [...nds, block]);
  }
  const [toast, setToast] = useState(null)
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") setTimeout(() => setToast(null), 3000);
  };
  const handleSave = useCallback(() => {
    // const rebuiltTree = rebuildLogicTree(nodes, edges);
    setProjet((prev) => {
      if (prev != null) {
        const updatedEndpoints = prev.rest_api.endpoints;
        if (updatedEndpoints[endpoint]) {
          updatedEndpoints[endpoint].logic = {
            // ...updatedEndpoints[endpoint].logic,
            node: JSON.stringify(nodes),
            edge: JSON.stringify(edges)
          };
        }
        return {
          ...prev,
          rest_api: { ...prev.rest_api, endpoints: updatedEndpoints },
        };
      } else {
        return { ...prev };
      }
    });
    showToast("Script Saved ! ", "success")
  }, [nodes, edges, endpoint, setProjet]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  const onNodeClick = useCallback((event, node) => {
    fitBounds(
      {
        x: node.position.x,
        y: node.position.y,
        width: node.measured?.width || 350,   // Utilise la largeur réelle si mesurée, sinon 250
        height: node.measured?.height || 300, // Utilise la hauteur réelle si mesurée, sinon 180
      },
      {
        duration: 600, // Animation rapide et fluide (0.6 seconde)
        padding: 3,  // Garde une marge agréable autour du nœud cliqué
      }
    );
  }, [fitBounds]);



  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}

    >
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 p-1.5 rounded-2xl bg-white/70 dark:bg-gray-900/80 border border-slate-200/50 dark:border-slate-800/60 shadow-xl shadow-black/10 backdrop-blur-md transition-all">
        {/* Bouton Sauvegarder */}
        <button
          onClick={handleSave}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-couleur1 dark:text-couleur2 bg-white dark:bg-couleur1 border border-transparent hover:border-couleur2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save size={14} className="transition-transform duration-200 group-hover:scale-110" />
          <span>Save</span>
        </button>

        {/* Separateur visuel subtil */}
        <div className="h-4 w-px bg-slate-300/50 dark:bg-slate-700/50" />

        {/* Bouton Fermer */}
        <button
          onClick={() => {
            setToggleVisualScriptModal("none");
          }}
          className="group px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-couleur1 dark:text-couleur2 bg-white dark:bg-couleur1 border border-transparent hover:border-red-500/50 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} className="rotate-45 transition-transform duration-200 group-hover:rotate-185" />
          <span>Close</span>
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden " >
        {/* BARRE LATÉRALE D'INSTRUCTIONS D'API */}
        {!openTab && <button
          onClick={() => setOpenTab(true)}
          title="Open side panel"
          className="group fixed left-0 -translate-x-3 hover:translate-x-0 transition-transform duration-200 ease-out z-50 top-10 flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-r-xl shadow-xl shadow-black/10 bg-white dark:bg-couleur1 text-couleur1 dark:text-couleur2 border border-l-0 border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md cursor-pointer hover:border-couleur2"
        >
          <PanelLeft className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />

          {/* Indicateur visuel d'ouverture subtil au survol */}
          <span className="text-xs font-semibold max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out">
            Panel
          </span>
        </button>}
        <div
          style={{ scrollbarWidth: "none" }}
          className={`fixed top-0 bottom-0 z-40 w-64 h-screen flex flex-col gap-3 p-3 bg-white/80 dark:bg-gray-900/90 backdrop-blur-2xl border-r border-couleur2/40 shadow-2xl overflow-y-auto transition-all duration-300 ease-out scrollbar-none ${openTab ? "left-0" : "-left-64"
            }`}
        >
          {/* En-tête du Panneau */}
          <div className="flex items-center justify-between px-2 pt-2 pb-3 border-b border-gray-200/50 dark:border-gray-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-couleur2 animate-pulse" />
              <h4 className="text-couleur1 text-base font-bold tracking-wide">
                Base Blocks
              </h4>
            </div>
            <button
              onClick={() => setOpenTab(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Fermer le panneau"
            >
              <Plus size={18} className="rotate-45" />
            </button>
          </div>

          {/* Section : Bloc de Contrôle de Flux */}
          <div className="flex flex-col gap-1.5">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Control Flow
            </span>
            <button onClick={() => addRootBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> RootNode
            </button>
            <button onClick={() => addStatusCodeBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> Status Code
            </button>
            <button onClick={() => addTryCatchBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> Try Catch
            </button>
            <button onClick={() => addWhileBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> While
            </button>
            <button onClick={() => addForBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> For
            </button>
            <button onClick={() => addConditionBlock()} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> If/Else
            </button>
            <button onClick={() => addNewBlock("function")} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> Function
            </button>
            <button onClick={() => addNewBlock("var")} className="dbModelStyle flex items-center gap-2">
              <Plus size={14} /> Var
            </button>
            <button onClick={() => addResponseBlock()} className="dbModelStyle flex items-center gap-2">
              <GrReturn size={14} /> Response
            </button>
          </div>

          {/* Section : Modèles de données */}
          {model && model.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200/50 dark:border-gray-800/60">
              <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Database Models
              </span>
              {model.map((mdl, index) => (
                <button
                  key={`model-${mdl.nom}-${index}`}
                  className="dbModelStyle flex items-center gap-2"
                  onClick={() => addModelBlock(mdl.nom, mdl)}
                >
                  <Database size={14} /> {mdl.nom} Model
                </button>
              ))}
            </div>
          )}

          {/* Section : Params du Body */}
          {endPointModel &&
            endPointModel.map((mdl, index) => (
              <div key={`endpoint-${mdl.nom}-${index}`} className="flex flex-col gap-1.5 pt-2 border-t border-gray-200/50 dark:border-gray-800/60">
                <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {mdl.nom} Body Params
                </span>
                {mdl.champs &&
                  mdl.champs.map((field, fieldIdx) => (
                    <button
                      key={`field-${field.nom}-${fieldIdx}`}
                      className="dbModelStyle w-full flex items-center gap-2"
                      onClick={() => addBodyParamsBlock({ field: field })}
                    >
                      <Puzzle size={14} /> {field.nom}
                    </button>
                  ))}
              </div>
            ))}

          {/* Section : Request Params */}
          {typeof project === "object" && project != null && endpoint !== undefined && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200/50 dark:border-gray-800/60 pb-6">
              <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Request Params
              </span>
              {project.rest_api?.endpoints?.[endpoint]?.params?.map((p, idx) => (
                <button
                  key={`param-${p}-${idx}`}
                  className="dbModelStyle w-full flex items-center gap-2 font-mono text-xs"
                  onClick={() => addRequestParamsBlock(`${p}`)}
                >
                  <span className="text-couleur2 font-bold">:</span>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        {toast && (
          <Toast toast={toast}></Toast>
        )}
        {/* CANVAS DE VISUAL SCRIPTING */}
        <div className="bg-couleur3 " style={{ flex: 1, position: "relative" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
            colorMode={colorMode}
            proOptions={{ hideAttribution: true }}
            onNodeDoubleClick={onNodeClick}
          >
            <Background gap={30} variant="lines" />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function TurboStackScripting(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  )
}