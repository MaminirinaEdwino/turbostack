import { GripVertical } from "lucide-react";

export default function Block({block, getIconForTag, index}) {
    return <div className="flex items-center gap-3">
        <div className="cursor-grab active:cursor-grabbing text-couleur1/20 group-hover:text-couleur1/60 transition-colors" onClick={(e) => e.stopPropagation()}>
            <GripVertical size={14} />
        </div>
        <div className="p-1.5 bg-couleur1/10 rounded-lg text-couleur1">
            {getIconForTag(block.tag)}
        </div>
        <div>
            <span className="text-[10px] font-black text-couleur1 dark:text-gray-400 uppercase tracking-tighter">
                {block.tag}
            </span>
            <p className="text-[11px] opacity-40 font-mono">#{index + 1}</p>
        </div>
    </div>
}