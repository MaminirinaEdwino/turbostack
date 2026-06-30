import { Handle, Position } from "@xyflow/react";
import { Plug } from "lucide-react";

export default function SelectNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };

  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono" >
      <div className="text-center mb-2 text-white/50  border-b border-couleur2"> GET {data.selectedType} FROM {data.model.nom}</div>
      <div className="text-[10px] border-b border-couleur2 p-2">
        {data.model.champs.map((field) => <div className="text-couleur2 flex  gap-2 items-center" > <input type="checkbox" id={ field.nom } onChange={(e)=>onChange(`${field.nom}`, e.target.value)} /> <label for={field.nom}>{ field.nom }</label></div>)}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <div className="flex justify-center text-couleur2">
        <button className="flex justify-center gap-1 items-center text-[10px]" onClick={()=>data.addChildAutomatically(id, "whereNode", {selectedType: data.selectedType, model: data.model})}> <Plug size={10}/> WHERE </button>
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
