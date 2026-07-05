import { Handle, Position } from "@xyflow/react";

export default function TryCatchNode({ id, data, isConnectable }) {
  return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40">
    <div className="relative border-b border-couleur2 py-2 ">
      <Handle
        id={"try_target_handle"}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <h3 className="text-center text-white/50">Try</h3>
      <Handle
        id={"try_source_handle"}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
    <div className="relative py-2">
      <Handle
        id={"catch_handle"}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <h3 className="text-center text-white/50">
        Catch
      </h3>
    </div>
  </div>
}
