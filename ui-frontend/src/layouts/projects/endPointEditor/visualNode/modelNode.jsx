import { Handle, Position } from "@xyflow/react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Plug } from "lucide-react";
import { useState } from "react";

export default function ModelNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  const [expand, setExpand] = useState(false);
  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono">
      <div className="w-full text-center dark:text-white/50 border-b b-2 border-b-couleur2">{data.name}</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="p-2 text-[10px] text-couleur2 border-b">
        <div>
          {data.model.champs.map((field) => <div><span className="">{field.nom}</span>:<span>{field.type}</span> <span>{ field.default_value}</span> </div>)}
        </div>
      </div>
      <div className={`flex gap-2 p-2 flex-col items-start text-couleur2 overflow-hidden transition-all duration-500 ${!expand && "h-8"}` }>
        <button onClick={()=>setExpand(!expand)} className="text-[.7rem] flex items-center justify-between w-full cursor-pointer">Function {expand ? <ChevronUp /> : <ChevronDown/>} </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> GET ALL
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> GET ONE
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> GET BY
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> UPDATE
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> INSERT
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "selectNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> DELETE
        </button>
        <button
          onClick={() => data.addChildAutomatically(id, "whereNode")}
          className="nodrag flex gap-1 justify-center items-center text-[10px] cursor-pointer"
        >
          <Plug size={10}/> JOIN
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
    </div>
  );
}
