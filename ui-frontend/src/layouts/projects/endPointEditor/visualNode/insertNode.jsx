import { Handle, Position } from "@xyflow/react";
import { Plug } from "lucide-react";

export default function InsertNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return <div className="blocNode2">
    <div>
      <h2 className="m-2 border-couleur2 text-white/50 border-b text-center">Insert into </h2>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          top: "20px",
          background: "green",
          borderColor: "white"
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
    {/* <div className="text-sm mx-2 text-couleur2 border-b">Values</div>*/}
    {
      data.model.champs.map((field) => <div className="my-2 text-couleur2 text-[10px]">
        <div className="flex items-center relative flex-row gap-3">
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              top: "3px",
              position: "relative",
              // left: "-8px"
            }}
            id={"insert-value-" + field.nom}
          />
          {field.nom}
        </div>
      </div>)
    }
    <div className="border-b border-couleur2 m-2">

    </div>

    <div>
      <button className="p-2 text-couleur2 flex text-[9px] gap-2 items-center" onClick={() => data.addChildAutomatically(id, "returnNode", { model: data.model, parentType: "insertNode" })}> <Plug size={10} /> RETURN</button>
    </div>
  </div>
}
