import { Handle, Position } from "@xyflow/react";

export default function IfNode({ id, data, isConnectable }) {
    return <div className="blocNode2">
        <div>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={"condition_target_handle"}
            />
            <h2 >If</h2>
        </div>
        <div >
            <h3 >condition</h3>
            <div className="flex w-full text-couleur2 justify-evenly">
                <button onClick={() => data.addChildAutomatically(id, "superiorNode", {})}>{'>'}</button>
                <button onClick={() => data.addChildAutomatically(id, "inferiorNode", {})}>{'<'}</button>
                <button onClick={() => data.addChildAutomatically(id, "equalNode", {})}>{'=='}</button>
                <button onClick={() => data.addChildAutomatically(id, "differentNode", {})}>{'!='}</button>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id={"condition_handle"}
            />
        </div>
        <div >
            <h3>Execute</h3>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id={"instruction_handle"}
            />
        </div>
    </div>
}