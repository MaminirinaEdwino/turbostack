import { Plus } from "lucide-react";

export default function NewController({setProject, pages, typeKey}) {
    return <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-couleur1">Project Logic</h2>
        <button onClick={() => {
            const newController = { nom: "New Controller", page_nom: pages[0]?.nom || "", bindings: [] };
            setProject(prev => ({
                ...prev, [typeKey]: { ...prev[typeKey], controllers: [...(prev[typeKey].controllers || []), newController] }
            }));
        }} className="bg-couleur1 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={18} /> Add Controller
        </button>
    </div>
}