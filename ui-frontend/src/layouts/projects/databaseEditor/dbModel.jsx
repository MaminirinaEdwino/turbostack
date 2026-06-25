import { Edit, Trash2 } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export default function DbModel({ data }) {
  const handleOnclick = () => {};
  return (
    <div
      className="border border-couleur1 rounded-lg overflow-hidden relative bg-white min-w-50 dark:border-none"
      onClick={handleOnclick}
    >
      {/* Points de connexion pour les relations */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-couleur1! w-2! h-2! border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-couleur1! w-2! h-2! border border-white"
      />

      <div className="border-b border-couleur6  p-2 bg-couleur3 flex justify-between items-center dark:bg-couleur1">
        <span className="font-medium dark:text-white/50">{data.nom}</span>
        <div className="flex gap-2">
          <button
            className="cursor-pointer text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit();
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div>
        {data.champs.map((item, index) => (
          <div
            key={index}
            className="p-2 border-t border-couleur1/10 last:border-b-0 flex justify-between text-xs"
          >
            <span className="font-medium text-gray-700">
              {item.nom} :{" "}
              <span className="opacity-50 uppercase">{item.type}</span>
            </span>
            <div className="flex gap-1 text-[10px]">
              {item.default_value && (
                <span
                  className="bg-gray-100 px-1 rounded text-gray-400"
                  title="Default value"
                >
                  {item.default_value}
                </span>
              )}
              {item.constraint && (
                <div className="flex gap-1">
                  {(Array.isArray(item.constraint)
                    ? item.constraint
                    : [item.constraint]
                  ).map((c, i) => {
                    const isRel =
                      typeof c === "string" && c.startsWith("relation:");
                    return (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-500 px-1 rounded font-bold"
                        title="Constraint"
                      >
                        {isRel ? `🔗 ${c.split(":")[1]}` : c}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
