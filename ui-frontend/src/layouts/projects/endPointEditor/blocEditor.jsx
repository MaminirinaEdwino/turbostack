import React, { useState, useEffect, useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  FunctionNode,
  ModelNode,
  SelectNode,
  VarNode,
  WhereNode,
} from "./customNode";

// Déclaration des types de nœuds sur mesure
const nodeTypes = {
  functionNode: FunctionNode,
  varNode: VarNode,
  modelNode: ModelNode,
  selectNode: SelectNode,
  whereNode: WhereNode,
};

// ==========================================
// 1. TRADUCTION : De l'Arbre Imbriqué -> Liste Plate (Gère plusieurs enfants)
// ==========================================
function flattenLogicTree(
  logicNode,
  onNodeDataChange,
  onDeleteNode,
  addChildAutomatically,
) {
  const nodes = [];
  const edges = [];

  function traverse(currentNode, parentId = null, depth = 0, indexOffset = 0) {
    if (!currentNode || Object.keys(currentNode).length === 0) return null;

    const isFunction = !!currentNode.function;
    const nodeType = isFunction ? "functionNode" : "varNode";
    const currentId = isFunction
      ? `func_${currentNode.function.name || "new"}_${Math.random().toString(36).substr(2, 5)}`
      : `var_${currentNode.var.name || "new"}_${Math.random().toString(36).substr(2, 5)}`;

    const data = isFunction
      ? { ...currentNode.function }
      : { ...currentNode.var };

    // Ajustement de la position X/Y pour étaler visuellement les branches multiples
    const position = { x: depth * 280 + 50, y: indexOffset * 180 + 100 };

    nodes.push({
      id: currentId,
      type: nodeType,
      position,
      data: {
        ...data,
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    });

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
      });
    }

    // Gestion du tableau multi-enfants (children)
    if (isFunction && Array.isArray(currentNode.function.children)) {
      currentNode.function.children.forEach((child, idx) => {
        // Chaque enfant est décalé verticalement pour éviter la superposition
        traverse(child, currentId, depth + 1, indexOffset + idx);
      });
    }
  }

  traverse(logicNode);
  return { initialNodes: nodes, initialEdges: edges };
}

// ==========================================
// 2. TRADUCTION : De la Liste Plate -> Arbre Imbriqué (Multi-enfants)
// ==========================================
function rebuildLogicTree(nodes, edges) {
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));

  if (!rootNode) return {};

  function buildNode(currentNode) {
    const isFunction = currentNode.type === "functionNode";

    if (isFunction) {
      // Trouver TOUS les liens sortants depuis ce nœud vers des enfants
      const edgesToChildren = edges.filter((e) => e.source === currentNode.id);

      const childrenNodes = edgesToChildren
        .map((edge) => nodes.find((n) => n.id === edge.target))
        .filter(Boolean);

      // Nettoyage des callbacks UI avant de générer le JSON
      const { onNodeDataChange, onDeleteNode, children, ...pureData } =
        currentNode.data;

      return {
        function: {
          ...pureData,
          // Reconstitution récursive du tableau d'enfants
          children: childrenNodes.map((childNode) => buildNode(childNode)),
        },
      };
    } else {
      const { onNodeDataChange, onDeleteNode, ...pureData } = currentNode.data;
      return {
        var: {
          name: pureData.name || "",
          type: pureData.type || "string",
          "default value": pureData["default value"] || "",
        },
      };
    }
  }

  return buildNode(rootNode);
}

// ==========================================
// COMPOSANT LOGIQUE DE TURBOSTACK
// ==========================================
export default function TurboStackScripting({ setProjet, endpoint, project }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [model, setModel] = useState([]);

  useEffect(() => {

    if (typeof (project) == "object" && endpoint != null) {
      console.log(project, endpoint)
      setModel(project?.rest_api.endpoints[endpoint].model)
    }
  }, [endpoint, project])

  const isValidConnection = useCallback(
    (connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;
      if (sourceNode == targetNode) return false;
      if (targetNode.type == "selectNode" && sourceNode.type != "modelNode")
        return false;
      const queryModifiers = ["whereNode", "joinNode"];
      if (queryModifiers.includes(targetNode.type)) {
        const validSources = ["selectNode", "whereNode", "joinNode"];
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
    (parentId, childType) => {
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
          name: childType === "selectNode" ? "SelectFields" : "WhereCondition",
          onNodeDataChange,
          onDeleteNode,
          addChildAutomatically: parentNode.data.addChildAutomatically, // Permet le chaînage à l'infini (ex: dbModel -> select -> where)
        };

        const newChildNode = {
          id: childId,
          type: childType,
          position: childPosition,
          data: blockData,
        };

        // Ajouter le lien immédiatement
        setEdges((currentEdges) => [
          ...currentEdges,
          { id: `e-${parentId}-${childId}`, source: parentId, target: childId },
        ]);

        return [...currentNodes, newChildNode];
      });
    },
    [onDeleteNode, onNodeDataChange],
  );
  // Charger la structure de données de l'API
  useEffect(() => {
    if (endpoint?.logic?.node) {
      const { initialNodes, initialEdges } = flattenLogicTree(
        endpoint.logic.node,
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      );
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [endpoint, onNodeDataChange, onDeleteNode, addChildAutomatically]);

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

  const addModelBlock = (name) => {
    const uniqueId = `modelNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const modelBlock = {
      id: uniqueId,
      type: "modelNode",
      position: basePosition,
      data: {
        name: name,
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    };

    setNodes((nds) => [...nds, modelBlock]);
  };

  const addSelectBlock = () => {
    const uniqueId = `selectNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const selectBlock = {
      id: uniqueId,
      type: "selectNode",
      position: basePosition,
      data: {
        field: [],
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    };

    setNodes((nds) => [...nds, selectBlock]);
  };

  const addWhereBlock = () => {
    const uniqueId = `whereNode_${Math.random().toString(36).substr(2, 5)}`;
    const basePosition = { x: nodes.length * 50 + 100, y: 200 };

    const selectBlock = {
      id: uniqueId,
      type: "whereNode",
      position: basePosition,
      data: {
        condition: "",
        onNodeDataChange,
        onDeleteNode,
        addChildAutomatically,
      },
    };

    setNodes((nds) => [...nds, selectBlock]);
  };
  const handleSave = useCallback(() => {
    const rebuiltTree = rebuildLogicTree(nodes, edges);

    setProjet((prev) => {
      if (prev != null) {
        const updatedEndpoints = prev.rest_api.endpoints;
        if (updatedEndpoints[endpoint]) {
          updatedEndpoints[endpoint].logic = {
            ...updatedEndpoints[endpoint].logic,
            node: rebuiltTree,
          };
        }
        console.log(updatedEndpoints);
        return {
          ...prev,
          rest_api: { ...prev.rest_api, endpoints: updatedEndpoints },
        };
      } else {
        return { ...prev };
      }
    });
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

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={handleSave}
        style={{
          marginBottom: 10,
          padding: "10px 20px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Enregistrer la logique de l'API ({endpoint})
      </button>

      <div
        style={{
          display: "flex",
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* BARRE LATÉRALE D'INSTRUCTIONS D'API */}
        <div
          style={{
            width: "200px",
            background: "#24283b",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderRight: "1px solid #45475a",
          }}
        >
          <h4
            style={{ color: "#a9b1d6", margin: "0 0 10px 0", fontSize: "14px" }}
          >
            Composants API
          </h4>
          <button
            onClick={() => addNewBlock("function")}
            style={{
              padding: "8px",
              background: "#3d59a1",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Action (Fonction)
          </button>
          <button
            onClick={() => addNewBlock("var")}
            style={{
              padding: "8px",
              background: "#e0af68",
              color: "#1a1b26",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Variable locale
          </button>
          {
           model.map((mdl) => (
              <>
                <button
                  className="px-8 py-2 bg-couleur1 rounded-sm cursor-pointer font-bold border-none"
                  onClick={() => {
                    addModelBlock(mdl.nom);
                  }}
                >
                  {mdl.nom} model
                </button>
              </>
            ))}

          <button onClick={addSelectBlock}>SELECT</button>
          <button onClick={addWhereBlock}>WHERE</button>
        </div>

        {/* CANVAS DE VISUAL SCRIPTING */}
        <div style={{ flex: 1, position: "relative", background: "#1a1b26" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
          >
            <Background color="#565f89" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
