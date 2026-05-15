import { BLOCK_TYPES } from "../defaultVar";

export default function BlockTab({addBlock, renderBlocksList, blocks}) {
    return <div className="space-y-6">
        <div className="flex flex-col gap-3 px-2">
            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Element List</label>
            <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((type) => (
                    <button
                        key={type.tag}
                        onClick={() => addBlock(type)}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-gray-900 border border-couleur1/10 rounded-2xl hover:border-couleur1 hover:shadow-sm transition-all group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-couleur1/10 flex items-center justify-center text-couleur1 group-hover:bg-couleur1 group-hover:text-white transition-colors">
                            {type.icon}
                        </div>
                        <span className="text-[10px] font-bold text-couleur1 dark:text-gray-300 text-center">
                            {type.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-couleur1/10">
            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider px-2">Structure actuelle</label>
            {renderBlocksList(blocks)}
        </div>
    </div>
}