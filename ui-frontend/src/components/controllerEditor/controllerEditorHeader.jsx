import { Cpu, Save } from "lucide-react";
import { FcPrevious } from "react-icons/fc";

export default function ControllerEditorHeader({handleSave, projectName, editMode, setEditMode, navigateTo}) {

    return <div className="p-4 flex items-center justify-between border-b border-couleur1/10 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
            <button onClick={() => editMode ? setEditMode(false) : navigateTo("Dashboard")} className="p-2 rounded-xl border hover:bg-white transition-all">
                <FcPrevious size={18} />
            </button>
            <h1 className="text-xl font-bold text-couleur1 flex items-center gap-2">
                <Cpu size={24} /> Controller Editor : {projectName}
            </h1>
        </div>
        <button onClick={handleSave} className="bg-couleur1 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
            <Save size={18} /> Save All
        </button>
    </div>
}