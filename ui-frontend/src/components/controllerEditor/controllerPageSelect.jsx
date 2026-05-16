import { FileText } from "lucide-react";

export default function ControllerPageSelect({activeController, updateController, selectedIndex, pages}) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
            <label className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2"><FileText size={14} /> Target Page</label>
            <select
                value={activeController?.page_nom || ""} // Assurez-vous que la valeur est une chaîne vide si null
                onChange={(e) => updateController(selectedIndex, 'page_nom', e.target.value)}
                className="w-full p-3 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
            >
                <option value="">Select a page...</option>
                {pages.map(p => <option key={p.nom} value={p.nom}>{p.nom} ({p.uri})</option>)}
            </select>
        </div>
    </div>
}