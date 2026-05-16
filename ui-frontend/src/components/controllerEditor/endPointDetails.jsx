import { ChevronDown, ChevronRight, Database } from "lucide-react";

export default function EndPointDetails({collapsedEndpoints, ep}) {
    return <div className="flex items-center gap-3">
        <div className="text-couleur1/40 group-hover:text-couleur1 transition-colors">
            {collapsedEndpoints[ep.nom] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </div>
        <Database size={14} className="text-couleur1/40" />
        <span className="text-xs font-black uppercase text-couleur1 tracking-wider">{ep.nom}</span>
        <span className="text-[9px] bg-couleur1/5 px-2 py-0.5 rounded text-couleur1/40">{ep.method} {ep.uri}</span>
    </div>
}