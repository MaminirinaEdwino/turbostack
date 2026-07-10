import { Edit, Trash2, Globe, Code } from "lucide-react";

export default function EndpointNode({ data }) {
  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-amber-500",
    DELETE: "bg-red-500",
  };
  const methodWithBody = [
    'PUT',
    'POST',
    'PATCH'
  ]
  return (
    <div className="border border-couleur1 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-gray-800 min-w-60 shadow-sm dark:border-none">
      <div className="border-b border-couleur1 dark:border-white/10 p-2 bg-couleur3 dark:bg-gray-900 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${methodColors[data.method] || "bg-gray-500"}`}
          >
            {data.method}
          </span>
          <span className="font-semibold text-sm truncate max-w-30 dark:text-white/50">
            {data.nom}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            className="dark:text-blue-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              data.onScript();
            }}
          >
            <Code size={14} />
          </button>
          <button
            className="text-blue-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit();
            }}
          >
            <Edit size={14} />
          </button>
          <button
            className="text-red-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
          >
            <Trash2 size={14} />
          </button>
          
        </div>
      </div>
      <div className="p-2 space-y-1">
        <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-mono bg-gray-50 dark:bg-gray-700 p-1 rounded">
          <Globe size={10} /> {data.uri}
        </div>
        {data.model && data.model.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.model.map((m, i) => (
              <span
                key={i}
                className="text-[9px] bg-couleur5 dark:bg-gray-900 border border-couleur1/20 dark:border-white/10 px-1 rounded text-gray-700 dark:text-gray-300"
              >
                {m.nom}
              </span>
            ))}
          </div>
        )}
      </div>
      {
        methodWithBody.includes(data.method) && <div className="p-3 space-y-1 box-border text-[10px]">
          <h3 className="dark:text-white/50">Body Content</h3>
          {data.model.length == 1 && <code className="dark:text-couleur2" >
            {"{"} <br />
            {data.model[0].champs && data.model[0].champs.map((field) => <>
              <span className="pl-4"></span>{field.nom} : {field.type == "string" ? "string" : 1} <br />
            </>)}
            {"}"}
          </code>}
        </div>
      }
      <div className="p-3 space-y-1 box-border text-[10px] ">
        <h3 className="dark:text-white/50">Response Body</h3>
        {data.return_content != null && data.return_content.length == 1 && <code className="dark:text-couleur2 " >
          {data.return_content_type == "array" && "["}
          {"{"} <br />
          {data.return_content[0].champs && data.return_content[0].champs.map((field) => <>
            <span className="pl-4"></span>{field.nom} : {field.type == "string" ? "string" : 1} <br />
          </>)}
          {"}"}
          {data.return_content_type == "array" && "]"}
        </code>}
      </div>
    </div>
  );
}
