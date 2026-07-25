import { Handle, Position } from "@xyflow/react";

export default function StatusCodeNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div className="blocNode2">
    <div>
      <h2 className="text-center text-white/50">Status Code</h2>
      <Handle
        type="source"
        id={"status_code"}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
    <select className="appearance-none px-3 py-1 m-2 nodrag dark:text-couleur2 text-couleur1 " onChange={(e) => onChange("status", e.target.value)}>
      <option className="text-couleur2" value={200}>OK 200</option>
      <option value={201}>Created 201</option>
      <option value={404}>Not found 404</option>
      <option value={500}>Serveur Error 500</option>
    </select>

  </div>
}
