import { Handle, Position } from "@xyflow/react";

export default function ReturnNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div id={id} className="blocNode2">
    <div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
    />
      <h2 className="text-white/50 text-center border-b border-couleur2">Return</h2>
    </div>
    {
      data.model.champs.map((field, id) => <div className="px-3 pb-2">
        <input className="hidden" type="checkbox" id={field.nom + id} onChange={(e) => onChange(`${field.nom}`, e.target.checked)} />
        <label htmlFor={field.nom + id} className={`text-[10px] ${data[field.nom] ? "text-couleur2" : "text-gray-900/80"}`}>
          {field.nom}
        </label>
      </div>)
    }
    
  </div>
}
