import { ChevronDown } from "lucide-react"
import AddChild from "./addChild"
import DeleteBlock from "./deleteBlock"
import Block from "./block"

export default function TreeBlocks({ handleDragStart, handleDragOver, handleDrop, setDraggedId, block, level, draggedId, activeBlock, selectBlock, indentAsChild, blocks, getIconForTag, addChild, removeBlock }) {
    return <div
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, block.id)}
        onDragEnd={() => setDraggedId(null)}
        style={{ marginLeft: `${level * 16}px` }}
        className={`shadow-lg drop-shadow-2xl hover:shadow-xl hover:drop-shadow-lg  drop-shadow-couleur6/10 shadow-couleur6/20 group p-3 rounded-2xl border transition-all cursor-pointer mb-2 ${draggedId === block.id ? "opacity-20 border-dashed border-couleur1 scale-95" : ""
            } ${activeBlock === block.id ? "bg-white dark:bg-gray-900 border-couleur1 shadow-md ring-4 ring-couleur1/5" : "bg-white/50 dark:bg-gray-900/40 border-transparent hover:border-couleur1/20"}`}
        onClick={() => selectBlock(block.id)}
        onDoubleClick={() => indentAsChild(blocks, block.id)}
    >
        <div className="flex justify-between items-center">
            <Block getIconForTag={getIconForTag} block={block} />
            <div className="flex items-center gap-1">
                {block.tag != "input" && <AddChild block={block} addChild={addChild} />}
                {block.children && block.children.length > 0 && <button onClick={() => {
                    if (document.getElementById(block.id + "_child_div").style.display == "none") {
                        document.getElementById(block.id + "_child_div").style.display = "block"
                    } else {
                        document.getElementById(block.id + "_child_div").style.display = "none"
                    }
                }}>
                    <div id={block.id + "_child_div_chevron"}>
                        <ChevronDown size={15}></ChevronDown>
                    </div>
                </button>}
                <DeleteBlock block={block} removeBlock={removeBlock} />
            </div>
        </div>
    </div>
}