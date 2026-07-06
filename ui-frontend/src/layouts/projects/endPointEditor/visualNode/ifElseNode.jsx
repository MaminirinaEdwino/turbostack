import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";

export default function IfElseNode({ id, data, isConnectable }) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <div className="relative">
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Condition</h2>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={'if_else_target_handle'}
            />
        </div>
        <div className="relative ">
            <h3 className="text-couleur2 p-4 flex justify-between">If  <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "ifNode", {})}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"if_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
        <div className="relative">
            <h3 className="text-couleur2 p-4 flex justify-between">Else If <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "elseIfNode", { "sourceHandle": "else_if_handle" })}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"else_if_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
        <div className="relative">
            <h3 className="text-couleur2 p-4 flex justify-between">Else <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "elseNode", { "sourceHandle": "else_handle" })}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"else_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
    </div>
}