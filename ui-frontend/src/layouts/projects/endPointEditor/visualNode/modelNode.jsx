import { Handle, Position, useNodeConnections } from "@xyflow/react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Plug } from "lucide-react";
import { useState } from "react";

export default function ModelNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  const [expand, setExpand] = useState(false);
  const isConnected = useNodeConnections({ id: id, handleType: "target", handleId: "model_handle_target" })
  // let otherData = {}
  return (

    <div className="blocNode2">
      <div>
        <h2 className="">{data.name}</h2>

        <Handle
          type="target"
          id={"model_handle_target"}
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ backgroundColor: `${isConnected.length > 0 && "#4ecdc4"}` }}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
      <div className="m-2 pb-2 text-[10px] text-couleur2 border-b">
        <div>
          {data.model.champs.map((field) => <div><span >{field.nom}</span>:<span>{field.type}</span> <span>{field.default_value}</span> </div>)}
        </div>
      </div>
      <div className={`flex gap-2 flex-col items-start text-couleur2 overflow-hidden transition-all duration-500 `}>
        <h3 onClick={() => setExpand(!expand)} className="text-[.7rem] flex items-center justify-between w-full cursor-pointer">Function {expand ? <ChevronUp /> : <ChevronDown />}
        </h3>

        {/* <button
          onClick={() => data.addChildAutomatically(id, "selectNode", {selectedType: "ONE"})}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> GET ONE
        </button>*/}
        {expand && <div className="flex flex-col items-start gap-1 px-2 pb-2">
          <button
            onClick={() => data.addChildAutomatically(id, "selectNode", { selectedType: "ALL", model: data.model })}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> GET ALL
          </button>
          <button
            onClick={() => data.addChildAutomatically(id, "selectNode", { selectedType: "BY", model: data.model })}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> GET BY
          </button>
          <button
            onClick={() => data.addChildAutomatically(id, "insertNode", { model: data.model })}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> INSERT
          </button>
          <button
            onClick={() => data.addChildAutomatically(id, "updateNode", { model: data.model })}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> UPDATE
          </button>

          <button
            onClick={() => data.addChildAutomatically(id, "deleteNode", { model: data.model })}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> DELETE
          </button>
          <button
            onClick={() => data.addChildAutomatically(id, "whereNode", {})}
            className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
          >
            <Plug size={10} /> JOIN
          </button>
        </div>}
      </div>

    </div>
  );
}
