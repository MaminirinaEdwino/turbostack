import React, { useState, useEffect, useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ==========================================
// 1. TRADUCTION : De l'Arbre Imbriqué -> Liste Plate (React Flow)
// ==========================================
function flattenLogicTree(logicNode) {
  const nodes = [];
  const edges = [];

  function traverse(currentNode, parentId = null, depth = 0, index = 0) {
    if (!currentNode) return null;

    // Déterminer le type et générer un ID unique
    const isFunction = !!currentNode.function;
    const nodeType = isFunction ? "functionNode" : "varNode";
    const currentId = isFunction
      ? `func_${currentNode.function.name}_${depth}_${index}`
      : `var_${currentNode.var.name}_${depth}_${index}`;

    // Extraction des données métiers
    const data = isFunction
      ? { ...currentNode.function }
      : { ...currentNode.var };

    // Positionnement visuel automatique de base (arbre de haut en bas ou gauche à droite)
    const position = { x: depth * 280 + 50, y: index * 150 + 100 };

    nodes.push({
      id: currentId,
      type: nodeType,
      position,
      data: {
        label: isFunction ? `Fonction: ${data.name}` : `Variable: ${data.name}`,
        ...data,
      },
    });

    // Créer un lien visuel si on vient d'un parent
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
      });
    }

    // Si c'est une fonction et qu'elle a un enfant, on continue la récursivité
    if (isFunction && currentNode.function.child) {
      traverse(currentNode.function.child, currentId, depth + 1, index);
    }
  }

  traverse(logicNode);
  return { initialNodes: nodes, initialEdges: edges };
}

// ==========================================
// 2. TRADUCTION : De la Liste Plate -> Arbre Imbriqué (Format TurboStack)
// ==========================================
function rebuildLogicTree(nodes, edges) {
  // Trouver le nœud racine (celui qui n'est la cible d'aucun lien/edge)
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));

  if (!rootNode) return {};

  function buildNode(currentNode) {
    const isFunction = currentNode.type === "functionNode";

    if (isFunction) {
      // Trouver le lien qui part de ce nœud fonction vers son enfant
      const edgeToChild = edges.find((e) => e.source === currentNode.id);
      const childNode = edgeToChild
        ? nodes.find((n) => n.id === edgeToChild.target)
        : null;

      return {
        function: {
          name: currentNode.data.name,
          params: currentNode.data.params || "",
          child: childNode ? buildNode(childNode) : {}, // Imbrication récursive
        },
      };
    } else {
      // C'est une variable
      return {
        var: {
          name: currentNode.data.name,
          type: currentNode.data.type,
          "default value": currentNode.data["default value"],
        },
      };
    }
  }

  return buildNode(rootNode);
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function TurboStackScripting({ setProjet, endpoint, project }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Charger le projet et aplatir l'arbre pour l'affichage au démarrage
  useEffect(() => {
    const setter = (initialNodes, initialEdges) => {
      setNodes(initialNodes);
      setEdges(initialEdges);
    };
    if (endpoint?.logic?.node) {
      const { initialNodes, initialEdges } = flattenLogicTree(
        endpoint.logic.node,
      );
      setter(initialNodes, initialEdges);
    }
  }, [endpoint]); // Se déclenche si on change de contexte/endpoint

  // Sauvegarder et reconstruire la structure imbriquée
  const handleSave = useCallback(() => {
    const rebuiltTree = rebuildLogicTree(nodes, edges);

    setProjet((prev) => ({
      ...prev,
      logic: {
        ...prev.logic,
        node: rebuiltTree, // On remet l'arbre imbriqué ici
      },
    }));
  }, [nodes, edges, setProjet]);

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
    <div style={{ width: "100%", height: "80vh" }}>
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
        }}
      >
        Enregistrer l'Arbre Logique {endpoint}{" "}
        {project != null && project.rest_api.endpoints[endpoint].uri}
      </button>
      <div
        className="flex"
        style={{ width: "100%", height: "100%", border: "1px solid #ddd" }}
      >
        <div>
          <button>var</button>
          <button>if</button>
          <button>function</button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  );
}
