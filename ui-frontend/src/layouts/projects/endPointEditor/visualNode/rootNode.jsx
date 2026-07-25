import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

export default function RootNode({ isConnectable }) {
  return <div className="epBlocNode">
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
