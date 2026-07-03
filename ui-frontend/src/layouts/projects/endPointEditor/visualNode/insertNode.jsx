import { Handle, Position } from "@xyflow/react";

export default function InsertNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div className="bg-gray-900 rounded-md border border-couleur2 min-w-40">
    <div className="m-2 border-couleur2 text-white/50 border-b text-center">Insert into </div>
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
    {/* <div className="text-sm mx-2 text-couleur2 border-b">Values</div>*/}
    {
      data.model.champs.map((field, id) => <div className="my-2 text-couleur2 text-[10px]">
        <div className="flex items-center relative flex-row">
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              top:"3px",
              position: "relative",
              // left: "-8px"
            }}
            id={"insert-value-"+field.nom}
          />
          {field.nom}
        </div>
      </div>)
    }

  </div>
}
