import { Handle,Position } from "@xyflow/react";
import nodestyle from "../nodeStyle";

export function VarNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div
      style={{ ...nodestyle, borderLeft: "4px solid #fab387" }}
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
