import { Handle, Position } from "@xyflow/react";

export default function InsertNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div className="bg-gray-900 p-2 rounded-md border border-couleur2">
    <div>Insert into {data.model.nom}</div>
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
    <div>Values</div>
    {
      data.model.champs.map((field, id) => <div className="flex gap-2">
        <div className="">
          <Handle
            nodeId={`insertNodeValue_${field}_${id}`}
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              top: `${(id+4) * 15}px`,
            }}
            aria-label="teste"
          />
          {field.nom}
        </div>
      </div>)
    }

  </div>
}
