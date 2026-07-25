import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";

export default function IfElseNode({ id, data, isConnectable }) {
    return <div className="blocNode2">
        <div className="">
            <h2 className="">Condition</h2>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={'if_else_target_handle'}
            />
        </div>
        <div className=" ">
            <h3 className="">If  <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "ifNode", {})}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"if_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
        <div className="">
            <h3 className="">Else If <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "elseIfNode", { "sourceHandle": "else_if_handle" })}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"else_if_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
        <div className="">
            <h3 className="">Else <button className="cursor-pointer" onClick={() => data.addChildAutomatically(id, "elseNode", { "sourceHandle": "else_handle" })}> <Plus size={14} /> </button></h3>
            <Handle
                type="source"
                id={"else_handle"}
                isConnectable={isConnectable}
                position={Position.Right}
            />

        </div>
    </div>
}