import { Layers } from "lucide-react";

export default function ChangeTabBtn({ activeTab, setter, value, icon, newVal }) {
    return <button
        onClick={() => setter(newVal)}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase transition-all duration-300 ${activeTab === newVal ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
    >
        {icon} 
        <span className={`${activeTab == newVal ? "block" : "hidden"} transition-all duration-500`} >{value}</span>
    </button>
}