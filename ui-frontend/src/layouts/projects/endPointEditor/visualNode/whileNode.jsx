import { Handle, Position } from "@xyflow/react";

export default function WhileNode({id,data, isConnectable}){
    return <div className="blocNode2">
        <div className="relative">
            <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">While</h2>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">condition</span>
            <div className="relative text-couleur2 flex justify-evenly">
                <button onClick={()=>data.addChildAutomatically(id, "superiorNode", {sourceHandle:"condition_handle"})}>{'>'}</button>
                <button onClick={()=>data.addChildAutomatically(id, "inferiorNode", {sourceHandle:"condition_handle"})}>{'<'}</button>
                <button onClick={()=>data.addChildAutomatically(id, "equalNode", {sourceHandle:"condition_handle"})}>{'=='}</button>
                <button onClick={()=>data.addChildAutomatically(id, "differentNode", {sourceHandle:"condition_handle"})}>{'!='}</button>
            </div>
            <Handle
                type="source"
                id={"condition_handle"}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
        <div className="relative">
            <span className="text-couleur2 p-4 flex justify-between">do</span>
            <Handle
                type="source"
                id={"do_handle"}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
    </div>
}