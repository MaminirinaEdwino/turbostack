import { Handle, Position } from "@xyflow/react";

export default function RequestParams({ id, data, isConnectable }) {
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
      contextMenu="teste"
      nodeId={id}
    />
    <h2 className="">Request params</h2>
   </div>
    <h3 className="text-[10px]">{data.requestParams} </h3>
  </div>
}
