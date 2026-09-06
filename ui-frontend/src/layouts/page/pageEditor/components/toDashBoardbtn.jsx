import { FcPrevious } from "react-icons/fc";

export default function ToDashBoardBtn({editMode, setEditMode, navigateTo}) {
    return <button
        onClick={() =>
            editMode ? setEditMode(false) : navigateTo("Dashboard")
        }
        className="p-2.5 rounded-xl border border-couleur1/20 dark:border-white/20 bg-white dark:bg-gray-800 text-couleur1 dark:text-gray-200 hover:bg-couleur1/10 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
        title={editMode ? "Exit edit mode" : "Return to Dashboard"}
    >
        <div className="flex items-center gap-1 text-couleur1 dark:text-gray-200">
            <FcPrevious size={18} />
        </div>
    </button>
}