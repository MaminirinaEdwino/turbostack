import { Handle, Position } from "@xyflow/react";
import { Plug } from "lucide-react";

export function ModelNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono">
      <div className="w-full text-center dark:text-white/50 border-b b-2 border-b-couleur2">{data.name}</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="flex gap-2 p-2 justify-center text-couleur2">
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> SELECT
        </button>

        <button
          onClick={() => data.addChildAutomatically(id, "whereNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> JOIN
        </button>
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
