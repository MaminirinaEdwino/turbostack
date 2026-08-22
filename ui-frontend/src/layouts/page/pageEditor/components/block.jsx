import { GripVertical } from "lucide-react";

export default function Block({ block, getIconForTag }) {
    return <div className="flex items-center gap-3">
        <div className="cursor-grab active:cursor-grabbing text-couleur1/20 group-hover:text-couleur1/60 transition-colors" onClick={(e) => e.stopPropagation()}>
            <GripVertical size={14} />
        </div>
        <div className="p-1.5 bg-couleur1/10 rounded-lg text-couleur1">
            {getIconForTag(block.tag)}
        </div>
        <div title={block.htmlId != "" ? "#"+block.htmlId : block.tag}>
            <p className="text-[10px] font-black text-couleur1 dark:text-gray-400 uppercase tracking-tighter w-17 truncate">
                {block.htmlId != "" ? "#"+block.htmlId : block.tag}
            </p>
            <p className="text-[11px] opacity-40 font-mono truncate  w-15 ">
                {block.tag != "input" && block.content != "" && block.content}
                {block.tag =="input" && block.placeholder != "" && ( block.inputType && block.inputType  == "submit" || block.inputType =="reset" ? block.inputType : block.placeholder)}
                {/* {block.tag =="input" && block.placeholder == "" && block.inpputType == "submit" || block.inputType == "reset" && block.inpputType} */}
            </p>
        </div>
    </div>
}