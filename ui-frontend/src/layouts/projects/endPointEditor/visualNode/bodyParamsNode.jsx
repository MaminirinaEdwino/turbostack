import { Handle, Position } from "@xyflow/react";

export default function BodyParamsNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return <div key={id} className="bg-gray-900 p-2 border border-couleur2 rounded-md text-couleur2">
    <Handle
      position={Position.Left}
      type="target"
      isConnectable={isConnectable}
    />
    <div className="text-[10px] border-b border-couleur2 mb-2">Request Body params</div>
    <div className="text-[10px]">{data.bodyParams.field.nom}: {data.bodyParams.field.type} {data.bodyParams.field.default_value}</div>
  </div>
}
