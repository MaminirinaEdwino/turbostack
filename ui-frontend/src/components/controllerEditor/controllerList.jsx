import { FileText, Trash2, Cpu, Edit3 } from "lucide-react";

export default function ControllerList({controllers, setSelectedIndex, setEditMode, setProject, typeKey}) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {controllers.map((ctrl, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-couleur1/10 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-couleur1/10 text-couleur1 rounded-xl"><Cpu size={24} /></div>
                    <div className="flex gap-2">
                        <button onClick={() => { setSelectedIndex(index); setEditMode(true); }} className="p-2 hover:bg-couleur1/5 text-couleur1 rounded-lg"><Edit3 size={18} /></button>
                        <button onClick={() => setProject(prev => {
                            const newControllers = prev[typeKey].controllers.filter((_, i) => i !== index);
                            return { ...prev, [typeKey]: { ...prev[typeKey], controllers: newControllers } };
                        })} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-couleur1 mb-1">{ctrl.nom}</h3>
                <div className="flex items-center gap-2 text-xs opacity-60">
                    <FileText size={12} /> Page: {ctrl.page_nom || "Not set"}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase opacity-40">{ctrl.bindings?.length || 0} Bindings Active</div>
            </div>
        ))}
    </div>
}