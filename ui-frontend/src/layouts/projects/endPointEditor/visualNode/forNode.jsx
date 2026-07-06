import { Handle, Position } from "@xyflow/react";

export default function ForNode({ id, data, isConnectable }) {
    const onChange = (field, value) => {
      if (data.onNodeDataChange) {
        data.onNodeDataChange(id, { ...data, [field]: value });
      }
    };
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">For</h2>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">value </span>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={"for_value_target"}
            />
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">to </span>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={"for_limit_target"}
            />
        </div>
        <div className="relative">
            <button className="text-couleur2 p-4 flex justify-between" onClick={()=>{
                if (data.increment) {
                    onChange("increment", !data.increment)
                }else{
                    onChange("increment", true)
                }

            }}> {data.increment ? "value++": "value--"} </button>
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">do </span>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id={"do"}
            />
        </div>
    </div>
}