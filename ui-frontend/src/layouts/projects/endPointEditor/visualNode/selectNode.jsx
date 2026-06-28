import { Position } from "@xyflow/react";

export function SelectNode({ id, data, isConnectable, selectType }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono" >
      <div className="text-center mb-2 text-white/50  border-b border-couleur2"> GET { selectType }</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <div className="flex justify-center text-couleur2">
        <button className="flex justify-center gap-1 items-center text-[10px]" onClick={()=>data.addChildAutomatically(id, "whereNode")}> <Plug size={10}/> WHERE </button>
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
