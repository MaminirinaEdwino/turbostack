import { Handle, Position } from "@xyflow/react";
import { Check, Plus } from "lucide-react";
import { useState } from "react";

export default function ResponseNode({ id, data, isConnectable }) {
  const [addResponse, setAddResponse] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return <div className=" text-couleur2 border border-couleur2 rounded-md bg-gray-900 min-w-40">

    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      id={"connect_from_parent"}
    />
    <h3 className="text-white/50 border-b border-couleur2 m-2 flex justify-between">Response
      <button onClick={()=>setAddResponse(!addResponse)}><Plus/></button>
    </h3>
    <div className="relative flex mb-2">
      <span className="px-2 text-[12px]">Status Code</span>
      <Handle
        type="target"
        id={"response_status"}
        position={Position.Left}
      />
    </div>
    {data.response && data.response.map((res) => <div className="relative flex ">
      <Handle
        type="target"
        id={"response_value"}
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <span className="mx-2 text-[12px]">{res}</span>
    </div>)}
    {addResponse && <div className="p-2 flex items-center">
      <input type="text" placeholder="field name" value={fieldName} onChange={(e)=>setFieldName(e.target.value)} className="border-b outline-couleur2 px-2 py-1 text-[10px]"/>
      <button className="p-1" onClick={() => {
        if (data.response) {
          let list = data["response"]
          list.push(fieldName)
          onChange("response", list)
          setFieldName("")
          setAddResponse(!addResponse)
        }
      }}><Check/></button>
    </div>}
  </div>
}
