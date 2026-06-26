import React from "react";
import { Handle, Position } from "@xyflow/react";

// Style commun pour les nœuds d'API
const nodeStyle = {
  background: "#1e1e2e",
  color: "#cdd6f4",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #45475a",
  minWidth: "200px",
  fontSize: "13px",
  fontFamily: "monospace",
};

// 1. NŒUD FONCTION (ex: Requête DB, Validation, Envoi de Réponse)
export function FunctionNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div style={nodeStyle} className="shadow-lg">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />

      <div
        className="flex justify-between items-center"
        style={{
          borderBottom: "1px solid #45475a",
          paddingBottom: "4px",
          marginBottom: "8px",
        }}
      >
        <span style={{ color: "#89b4fa", fontWeight: "bold" }}>
          ⚡ Action / Fonction
        </span>
        <button
          onClick={() => data.onDeleteNode(id)}
          style={{
            background: "#f38ba8",
            color: "#11111b",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "2px 6px",
            fontSize: "10px",
          }}
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label style={{ fontSize: "11px", color: "#a6adc8" }}>
          Nom de l'action :
        </label>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          className="nodrag"
          style={{
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: "4px",
            padding: "2px 4px",
          }}
        />

        <label style={{ fontSize: "11px", color: "#a6adc8" }}>
          Arguments / Params :
        </label>
        <input
          type="text"
          value={data.params || ""}
          onChange={(e) => onChange("params", e.target.value)}
          className="nodrag"
          placeholder="req, res"
          style={{
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: "4px",
            padding: "2px 4px",
          }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#a6e3a1" }}
      />
    </div>
  );
}

export function ModelNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return (
    <div className="p-2 bg-couleur6 ">
      <div>model {data.name}</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <div
        style={{
          background: "#24283b",
          padding: "8px",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#565f89", uppercase: "true" }}>
          Suites logiques disponibles :
        </span>

        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag"
          style={{
            background: "#3d59a1",
            color: "#fff",
            border: "none",
            padding: "4px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            textAlign: "left",
          }}
        >
          ➕ Ajouter un SELECT
        </button>

        <button
          onClick={() => data.addChildAutomatically(id, "joinNode")}
          className="nodrag"
          style={{
            background: "#bb9af7",
            color: "#fff",
            border: "none",
            padding: "4px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            textAlign: "left",
          }}
        >
          ➕ Ajouter un JOIN
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
    </div>
  );
}

export function WhereNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return (
    <div>
      <div>WHERE</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
    </div>
  );
}

export function SelectNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return (
    <div>
      <div> SELECT</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
    </div>
  );
}
// 2. NŒUD VARIABLE (ex: Payload d'entrée, Variable locale d'API)
export function VarNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div
      style={{ ...nodeStyle, borderLeft: "4px solid #fab387" }}
      className="shadow-lg"
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />

      <div
        className="flex justify-between items-center"
        style={{
          borderBottom: "1px solid #45475a",
          paddingBottom: "4px",
          marginBottom: "8px",
        }}
      >
        <span style={{ color: "#fab387", fontWeight: "bold" }}>
          📦 Variable
        </span>
        <button
          onClick={() => data.onDeleteNode(id)}
          style={{
            background: "#f38ba8",
            color: "#11111b",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "2px 6px",
            fontSize: "10px",
          }}
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nom"
          value={data.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          className="nodrag"
          style={{
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: "4px",
            padding: "2px 4px",
          }}
        />

        <select
          value={data.type || "string"}
          onChange={(e) => onChange("type", e.target.value)}
          className="nodrag"
          style={{
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: "4px",
            padding: "2px 4px",
          }}
        >
          <option value="string">String</option>
          <option value="int">Integer</option>
          <option value="boolean">Boolean</option>
          <option value="json">JSON / Object</option>
        </select>

        <input
          type="text"
          placeholder="Valeur par défaut"
          value={data["default value"] || ""}
          onChange={(e) => onChange("default value", e.target.value)}
          className="nodrag"
          style={{
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: "4px",
            padding: "2px 4px",
          }}
        />
      </div>
    </div>
  );
}
