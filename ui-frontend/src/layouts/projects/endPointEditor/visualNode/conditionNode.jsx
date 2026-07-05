import { Handle, Position } from "@xyflow/react";

export function EqualNode({ id, data, isConnectable }) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <Handle
                type="target"
                id={"equal_handle"}
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Equal</h2>
        </div>
        <div>
            <div className="relative">
                <Handle
                    type="source"
                    id={"equal_value_1_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 1</span>
            </div>
            <div className="relative">
                <Handle
                    type="source"
                    id={"equal_value_2_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 2</span>
            </div>
        </div>
    </div>
}

export function DifferentNode({ id, data, isConnectable }) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <Handle
                type="target"
                id={"different_handle"}
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Different</h2>
        </div>
        <div>
            <div className="relative">
                <Handle
                    type="source"
                    id={"different_value_1_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 1</span>
            </div>
            <div className="relative">
                <Handle
                    type="source"
                    id={"different_value_1_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 2</span>
            </div>
        </div>
    </div>
}

export function InferiorNode({ id, data, isConnectable }) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <Handle
                type="target"
                id={"inferior_handle"}
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Inferior</h2>
        </div>
        <div>
            <div relative>
                <Handle
                    type="source"
                    id={"inferior_value_1_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 1</span>
            </div>
            <div className="relative">
                <Handle
                    type="source"
                    id={"inferior_value_1_handle"}
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <span className="text-couleur2 p-4 flex justify-between">Value 2</span>
            </div>
        </div>
    </div>
}
export function SuperiorNode({ id, data, isConnectable }) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <Handle
                type="target"
                id={"superior_handle"}
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Superior</h2>
        </div>

        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">Value 1</span>
            <Handle
                type="source"
                id={"superior_value_1_handle"}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">Value 2</span>
            <Handle
                type="source"
                id={"superior_value_1_handle"}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
    </div>
}

