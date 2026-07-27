import { Handle, Position } from "@xyflow/react";

export default function BodyParamsNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return <div key={id} className="blocNode2">
    <div>
      <Handle
        position={Position.Right}
        type="source"
        isConnectable={isConnectable}
      />
      <h2 className="header">Request Body params</h2>
    </div>
    <h3 className="text-[10px]">{data.bodyParams.field.nom}: {data.bodyParams.field.type} {data.bodyParams.field.default_value}</h3>
  </div>
}
