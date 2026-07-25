import { Handle, Position } from "@xyflow/react";
// import {nodestyle} from "../nodeStyle";

export default function VarNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div className="blocNode2">
      <div
        className=""
      >
        <h2 >
          Variable
        </h2>
        {/* <button
          onClick={() => data.onDeleteNode(id)}
        >
          ✕
        </button>*/}
        <Handle
          id={"var_" + id}
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      </div>

      <div className="flex flex-col gap-5 p-2">
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
          className="nodrag appearance-none px-2 border-b"
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
          className="nodrag border-b px-2"
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
