import { Handle, Position } from "@xyflow/react";

export default function ElseIfNode({id, data, isConnectable}) {
    return <div className="bg-gray-900 border border-couleur2 rounded-md min-w-40 font-mono">
        <Handle 
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            id={"condition_target_handle"}
        />
        <h2 className="p-2 border-b border-couleur2 mx-2 text-center text-white/50">Else If</h2>
        <div className="relative">
            <h3 className="text-couleur2 p-4 flex justify-between">condition</h3>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id={"condition_handle"}
            />
            <div className="relative text-couleur2 flex justify-evenly">
                <button onClick={()=>data.addChildAutomatically(id, "superiorNode", {})}>{'>'}</button>
                <button onClick={()=>data.addChildAutomatically(id, "inferiorNode", {})}>{'<'}</button>
                <button onClick={()=>data.addChildAutomatically(id, "equalNode", {})}>{'=='}</button>
                <button onClick={()=>data.addChildAutomatically(id, "differentNode", {})}>{'!='}</button>
            </div>
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