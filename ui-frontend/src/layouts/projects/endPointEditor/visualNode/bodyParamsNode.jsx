import { Handle, Position } from "@xyflow/react";

export default function BodyParamsNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return <div key={id} className="epBlocNode">
    <Handle
      position={Position.Right}
      type="source"
      isConnectable={isConnectable}
    />
    <div className="header">Request Body params</div>
    <div className="text-[10px]">{data.bodyParams.field.nom}: {data.bodyParams.field.type} {data.bodyParams.field.default_value}</div>
  </div>
}
