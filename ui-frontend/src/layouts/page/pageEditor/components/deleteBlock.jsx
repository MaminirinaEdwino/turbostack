import { Trash2 } from "lucide-react";

export default function DeleteBlock({ block, removeBlock }) {
    return <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="text-red-400 hover:text-red-600 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={14} />
    </button>
}