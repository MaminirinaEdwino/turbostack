import { Blocks, FormIcon, ListTree, Palette, Puzzle, File } from "lucide-react"

export default function BlockTabNavBar({setActualTab, actualTab}) {
    return <div className='sticky flex gap-2 text-couleur1 top-1 w-full justify-between p-1.5 bg-white px-3 shadow-lg drop-shadow-white rounded items-center z-10'>
        <a href="#sb" onClick={() => setActualTab("sb")} className={`${actualTab == "sb" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
            <Blocks size={16} />
        </a>
        <a href="#components" onClick={() => setActualTab("components")} className={`${actualTab == "components" ? "bg-couleur1 text-couleur3 p-1 rounded " : "bg-transparent"} transition-all duration-500`}>
            <Puzzle size={16} />
        </a>
        <a href="#pagelib" onClick={() => { setActualTab("pagelib") }} className={`${actualTab == "pagelib" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
            <File size={16} />
        </a>
        <a href="#stylelib" onClick={() => { setActualTab("stylelib") }} className={`${actualTab == "stylelib" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
            <Palette size={16} />
        </a>
        <a href="#apiform" onClick={() => { setActualTab("apiform") }} className={`${actualTab == "apiform" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
            <FormIcon size={16} />
        </a>
        <a href="#structure" onClick={() => { setActualTab("structure") }} className={`${actualTab == "structure" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
            <ListTree size={16} />
        </a>
    </div>
}