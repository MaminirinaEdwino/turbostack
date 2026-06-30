import { Handle, Position } from "@xyflow/react";

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
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#f38ba8" }}
      />
      <div className="text-couleur2"> {data.model.nom}
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
              data[data.model.nom + "_check_" + field.nom]  && <div>
                <select className="" onChange={(e)=>onChange(data.model.nom+"_operator_"+field.nom, e.target.value)} >
                  <option value="=">=</option>
                  <option value=">=">=</option>
                  <option value="<="> {"<="} </option>
                  <option value="!=">!=</option>
                </select>
                <input className="bg-couleur2 rounded-sm mx-1 text-couleur1 px-1" type="text" onChange={(e) => onChange(data.model.nom + "_where_" + field.nom, e.target.value)}  />
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
    </div>
  );
}
