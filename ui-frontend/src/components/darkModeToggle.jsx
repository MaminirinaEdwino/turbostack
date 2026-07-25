import { useDispatch, useSelector } from "react-redux"
import { setToggleDarkMode } from "../appSlice"
import { Moon, Sun } from "lucide-react"

export default function DarkModeToggle() {
    const isDarkMode = useSelector((state)=>state.app.darkMode)
    const dispatch = useDispatch()
    
    return <>
        <button
            onClick={() => dispatch(setToggleDarkMode())}
            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all border-couleur7 text-couleur1 hover:bg-couleur1 hover:text-white justify-start fixed w-fit -right-8 z-50 dark:bg-couleur1 dark:text-white dark:border-none hover:right-2 ease-in-out bottom-2"
        >
            <div className="shrink-0">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
        </button>
    </>
}