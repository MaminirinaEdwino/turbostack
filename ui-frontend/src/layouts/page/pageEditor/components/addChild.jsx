import { PlusSquare } from "lucide-react";
import { BLOCK_TYPES } from "../defaultVar";

export default function AddChild({block, addChild}) {
    return <div className="relative group/add">
        <button className="p-1.5 text-couleur1/40 hover:text-couleur1 hover:bg-couleur1/10 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
            <PlusSquare size={14} />
        </button>
        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/add:flex flex-col bg-white dark:bg-gray-800 border border-couleur1/10 shadow-xl rounded-xl p-1 z-50 min-w-32 animate-in fade-in zoom-in-95 duration-200">
            {BLOCK_TYPES.map(type => (
                <button key={type.tag} onClick={(e) => { e.stopPropagation(); addChild(block.id, type); }} className="flex items-center gap-2 p-2 hover:bg-couleur1/5 rounded-lg text-[10px] font-bold text-couleur1 dark:text-gray-300">
                    {type.icon} {type.label}
                </button>
            ))}
        </div>
    </div>
}