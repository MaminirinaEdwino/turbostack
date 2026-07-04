import { Handle, Position } from "@xyflow/react";

export default function StatusCodeNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div className="bg-gray-900 p-2 border border-couleur2 rounded-md">
    <h3 className="text-center text-white/50">Status Code</h3>
    <select onChange={(e)=>onChange("status", e.target.value)}>
      <option value={200}>OK 200</option>
      <option value={201}>Created 201</option>
      <option value={404}>Not found 404</option>
      <option value={500}>Serveur Error 500</option>
    </select>
    <Handle
      type="source"
      id={"status_code"}
      position={Position.Right}
      isConnectable={isConnectable}
    />
  </div>
}
