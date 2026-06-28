import { Handle, Position } from "@xyflow/react";
import { nodeStyle } from "../nodeStyle";

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
