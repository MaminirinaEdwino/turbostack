import { Handle, Position } from "@xyflow/react";
import { Plug } from "lucide-react";

export default function WhereNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return (
    <div className="p-2 bg-gray-900 rounded-md min-w-40 border border-couleur2 font-mono">
      <div className="flex justify-center text-white/50 border-b border-couleur2 mb-2">WHERE</div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <div className="text-couleur2">
        {data.model.champs.map((field) => <>
          <div>
            <input
            className="hidden"
              type="checkbox"
              onChange={(e) => {
                onChange(data.model.nom+"_check_" + field.nom, e.target.checked)
              }}
              id={data.model.nom + "_where_for_" + data.model.nom + "" + field.nom}
            />
            <label htmlFor={data.model.nom + "_where_for_" + data.model.nom + "" + field.nom}
              className={data[data.model.nom+"_check_" + field.nom] && "border-b"}>  {field.nom} </label>
            {
              data[data.model.nom + "_check_" + field.nom]  && <div className="flex flex-col py-2">
                <select className="" onChange={(e)=>onChange(data.model.nom+"_operator_"+field.nom, e.target.value)} >
                  <option value="=">=</option>
                  <option value=">=">=</option>
                  <option value="<="> {"<="} </option>
                  <option value="!=">!=</option>
                </select>
                <input type="checkbox" id="check_param_type" onChange={(e) => onChange(data.model.nom + "_check_param_type_" + field.nom, e.target.checked)} className="hidden"/>
                <label htmlFor="check_param_type">{ !data[data.model.nom + "_check_param_type_" + field.nom] ? "useNode" : "enter value" }</label>
                {data[data.model.nom+"_check_param_type_" + field.nom] && <input className="bg-couleur2 rounded-sm mx-1 text-couleur1 px-1" type="text" onChange={(e) => onChange(data.model.nom + "_where_" + field.nom, e.target.value)} />}

                {!data[data.model.nom+"_check_param_type_" + field.nom]  &&  <Handle
                  type="target"
                  id={data.model.nom + "_where_" + field.nom + "target"}
                  position={Position.Left}
                  style={{
                    position: "relative"
                  }}
                  isConnectable={isConnectable}
                />}

              </div>
            }
          </div>
        </>)}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      {
        data.parentType != "deleteNode" && <>
          <div className="border-b border-couleur2"></div>
          <div>
            <button className="p-2 text-couleur2 flex text-[9px] gap-2 items-center" onClick={() => data.addChildAutomatically(id, "returnNode", { model: data.model })}> <Plug size={10}/> RETURN</button>
          </div>
        </>
      }
    </div>
  );
}
