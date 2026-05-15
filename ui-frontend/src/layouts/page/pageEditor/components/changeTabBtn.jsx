import { Layers } from "lucide-react";

export default function ChangeTabBtn({ activeTab, setter, value, icon, newVal }) {
    return <button
        onClick={() => setter(newVal)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === newVal ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
    >
        {icon} {value}
    </button>
}