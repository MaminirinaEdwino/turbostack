import { Handle, Position } from "@xyflow/react";

export default function WhereNode({ id, data, isConnectable }) {
  // const onChange = (field, value) => {
  //   if (data.onNodeDataChange) {
  //     data.onNodeDataChange(id, { ...data, [field]: value });
  //   }
  // };
  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono">
      <div className="flex justify-center text-white/50 border-b border-couleur2 mb-2">WHERE</div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
    </div>
  );
}
