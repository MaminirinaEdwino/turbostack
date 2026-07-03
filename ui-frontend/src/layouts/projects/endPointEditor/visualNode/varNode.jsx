import { Handle,Position } from "@xyflow/react";
// import {nodestyle} from "../nodeStyle";

export default function VarNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div
      className="shadow-lg bg-gray-900 p-2 border border-couleur2 rounded-md"
    >
      <Handle
      id={"var_"+id}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <div
        className="flex justify-between items-center"

      >
        <span style={{ color: "#fab387", fontWeight: "bold" }}>
          Variable
        </span>
        {/* <button
          onClick={() => data.onDeleteNode(id)}
        >
          ✕
        </button>*/}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nom"
          value={data.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          className="nodrag bg-couleur2 px-2 py-1 rounded-sm"
        />

        <select
          value={data.type || "string"}
          onChange={(e) => onChange("type", e.target.value)}
          className="nodrag"
        >
          <option value="string">String</option>
          <option value="int">Integer</option>
          <option value="boolean">Boolean</option>
          <option value="json">JSON / Object</option>
          <option value="node">Node</option>
        </select>

        <input
          type="text"
          placeholder="Default Value"
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
        <Handle
          type="source"
          isConnectable={isConnectable}
          position={Position.Right}
        />
      </div>
    </div>
  );
}
