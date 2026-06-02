import { ChevronDown, ChevronRight, Folder } from "lucide-react";

export default function FileExplorerDirectory({selectedPath, node, level, handleClick, isOpen}) {
    return <>
        <div
            className={`flex items-center gap-2 py-1.5 px-2 hover:bg-couleur1/5 cursor-pointer rounded-lg transition-colors group ${selectedPath === node.path ? 'bg-couleur1/10' : ''}`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={handleClick}
        >
            <div className="w-4 h-4 flex items-center justify-center">
                {node.is_dir && (
                    <span className="text-couleur1/40">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
            </div>
            {node.is_dir ? (
                <Folder size={16} className="text-couleur1 fill-couleur1/10" />
            ) : (
                <File size={16} className="text-couleur1/60" />
            )}
            <span className={`text-sm truncate ${node.is_dir ? 'font-bold text-couleur1' : 'text-couleur1/80'}`}>
                {node.name}
            </span>
            {!node.is_dir && (
                <span className="text-[9px] opacity-0 group-hover:opacity-40 ml-auto font-mono whitespace-nowrap bg-couleur1/10 px-1 rounded">
                    {(node.size / 1024).toFixed(1)} KB
                </span>
            )}
        </div>
    </>
}