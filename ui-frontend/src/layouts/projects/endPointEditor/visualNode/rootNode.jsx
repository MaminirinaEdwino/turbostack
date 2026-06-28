import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

export function RootNode({ isConnectable }) {
  return <div className="p-2 border border-couleur2 bg-couleur1 rounded-md text-couleur2 ">
    <Play size={14} className="" />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      style={{

      }}
    />
  </div>
}
