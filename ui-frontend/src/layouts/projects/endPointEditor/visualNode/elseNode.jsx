import { Handle, Position } from "@xyflow/react";

export default function ElseNode({ id, data, isConnectable }) {
    return <div className="blocNode2">
        <div>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={"condition_target_handle"}
            />
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Else</h2>
        </div>
        <div className="relative">
            <h3 className="text-couleur2 p-4 flex justify-between">Execute</h3>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id={"instruction_handle"}
            />
        </div>
    </div>
}