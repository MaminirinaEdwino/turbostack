import { Handle, Position } from "@xyflow/react";

export default function ReturnNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div id={id} className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2">
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
    />
    <h3 className="text-white/50 text-center border-b border-couleur2">Return</h3>
    {
      data.model.champs.map((field, id) => <div>
        <input className="hidden" type="checkbox" id={field.nom+id} onChange={(e)=>onChange(`${field.nom}`, e.target.checked)}/>
        <label htmlFor={field.nom+id} className={`text-[10px] ${data[field.nom] ? "text-couleur2" : "text-white/80"}`}>
          {field.nom}
        </label>
      </div>)
    }
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
    />
  </div>
}
