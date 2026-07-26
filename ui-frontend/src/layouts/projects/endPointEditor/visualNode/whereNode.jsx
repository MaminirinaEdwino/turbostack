import { Handle, Position } from "@xyflow/react";
import { Plug } from "lucide-react";

export default function WhereNode({ id, data, isConnectable }) {
  const onChange = (field, value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, [field]: value });
    }
  };
  return (
    <div className="blocNode2">
      <div>
        <h2 className="flex justify-center text-white/50 border-b border-couleur2 mb-2">WHERE</h2>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
      <div className="text-couleur2">
        {data.model.champs.map((field) => <>
          <div className="relative">
            <input
              className="hidden"
              type="checkbox"
              onChange={(e) => {
                onChange(data.model.nom + "_check_" + field.nom, e.target.checked)
              }}
              id={data.model.nom + "_where_for_" + data.model.nom + "" + field.nom}
            />
           <div className="flex justify-between items-center px-2">
             <label htmlFor={data.model.nom + "_where_for_" + data.model.nom + "" + field.nom}
              className={data[data.model.nom + "_check_" + field.nom] && "border-b"}>  {field.nom} </label>
            {data[data.model.nom + "_check_" + field.nom] && <label htmlFor={`${data.model.nom}_check_param_type_${field.nom}`} className="text-xs">{!data[data.model.nom + "_check_param_type_" + field.nom] ? "useNode" : "enter value"}</label>}
           </div>

            {
              data[data.model.nom + "_check_" + field.nom] && <div className="flex flex-col p-2 gap-2">
                <select className="appearance-none border-b outline-0 nodrag" onChange={(e) => onChange(data.model.nom + "_operator_" + field.nom, e.target.value)} >
                  <option value="=">=</option>
                  <option value=">=">{">"}=</option>
                  <option value="<="> {"<="} </option>
                  <option value="!=">!=</option>
                </select>
                <input type="checkbox" id={`${data.model.nom}_check_param_type_${field.nom}`} onChange={(e) => onChange(data.model.nom + "_check_param_type_" + field.nom, e.target.checked)} className="hidden" />

                {data[data.model.nom + "_check_param_type_" + field.nom] && <input className="border-couleur2 py-1 appearance-none border-b rounded-none text-couleur1 px-1" type="text" onChange={(e) => onChange(data.model.nom + "_where_" + field.nom, e.target.value)} />}

                {!data[data.model.nom + "_check_param_type_" + field.nom] && <div>
                  <Handle
                    type="target"
                    id={data.model.nom + "_where_" + field.nom + "target"}
                    position={Position.Left}

                    isConnectable={isConnectable}
                  /></div>}

              </div>
            }
          </div>
        </>)}
      </div>

      {
        data.parentType != "deleteNode" && <>
          <div className="border-b border-couleur2"></div>
          <div>
            <button className="p-2 text-couleur2 flex text-[9px] gap-2 items-center" onClick={() => data.addChildAutomatically(id, "returnNode", { model: data.model })}> <Plug size={10} /> RETURN</button>
          </div>
        </>
      }
    </div>
  );
}
