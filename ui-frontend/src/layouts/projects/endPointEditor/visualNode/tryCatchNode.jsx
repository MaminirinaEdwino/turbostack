import { Handle, Position } from "@xyflow/react";

export default function TryCatchNode({ id, data, isConnectable }) {
  return <div className="blocNode2">
    <div className="relative border-b border-couleur2  ">
      <Handle
        id={"try_target_handle"}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <h3 >Try</h3>
      <Handle
        id={"try_source_handle"}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
    <div className="">
      <Handle
        id={"catch_handle"}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <h3 >
        Catch
      </h3>
    </div>
  </div>
}
