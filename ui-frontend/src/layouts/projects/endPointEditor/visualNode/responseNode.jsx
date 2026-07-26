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
  return <div className="blocNode2">

   <div>
     <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      id={"connect_from_parent"}
    />
    <h2 className="text-white/50 border-b border-couleur2 m-2 flex justify-between">Response
      <button onClick={()=>setAddResponse(!addResponse)}> <div className={`${addResponse && "rotate-45"} transition-all duration-500`}><Plus/></div></button>
    </h2>
   </div>
    <div className="relative flex mb-2">
      <span className="px-2 text-[12px]">Status Code</span>
      <Handle
        type="target"
        id={"response_status"}
        position={Position.Left}
      />
    </div>
    {data.response && data.response.map((res) => <div className="relative flex py-2">
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
