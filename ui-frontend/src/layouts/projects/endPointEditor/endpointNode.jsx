import { Edit, Trash2, Globe } from "lucide-react";

export default function EndpointNode({ data }) {
    const methodColors = {
        'GET': 'bg-green-500',
        'POST': 'bg-blue-500',
        'PUT': 'bg-amber-500',
        'DELETE': 'bg-red-500'
    };

    return (
        <div className="border border-couleur1 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-gray-800 min-w-[200px] shadow-sm">
            <div className="border-b border-couleur1 dark:border-white/10 p-2 bg-couleur3 dark:bg-gray-900 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${methodColors[data.method] || 'bg-gray-500'}`}>{data.method}</span>
                    <span className="font-semibold text-sm truncate max-w-[120px]">{data.nom}</span>
                </div>
                <div className="flex gap-1">
                    <button className="text-blue-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); data.onEdit(); }}><Edit size={14} /></button>
                    <button className="text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); data.onDelete(); }}><Trash2 size={14} /></button>
                </div>
            </div>
            <div className="p-2 space-y-1">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-mono bg-gray-50 dark:bg-gray-700 p-1 rounded"><Globe size={10}/> {data.uri}</div>
                {data.model && data.model.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {data.model.map((m, i) => (
                            <span key={i} className="text-[9px] bg-couleur5 dark:bg-gray-900 border border-couleur1/20 dark:border-white/10 px-1 rounded text-gray-700 dark:text-gray-300">{m.nom}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}