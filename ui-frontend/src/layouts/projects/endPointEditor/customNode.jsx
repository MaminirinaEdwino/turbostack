import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Play, Plug, Plus } from "lucide-react";



// 2. NŒUD VARIABLE (ex: Payload d'entrée, Variable locale d'API)


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
