import { ChevronLeftCircle, HardDrive, RefreshCw } from "lucide-react";

export default function FileExplorerHeader({navigate, loadFiles, loading}) {
    return <>
        <div className="p-5 border-b border-couleur1/10 bg-couleur3/5 dark:bg-white/5 flex items-center justify-between">

            <div className="flex items-center gap-3">
                <div onClick={() => navigate('Dashboard')} className="p-2 bg-couleur1/10 rounded-xl">
                    <ChevronLeftCircle size={20} className="text-couleur1" />
                </div>
                <div className="p-2 bg-couleur1/10 rounded-xl">
                    <HardDrive size={20} className="text-couleur1" />
                </div>
                <h2 className="font-black text-couleur1 text-sm uppercase tracking-wider">Project Explorer</h2>
            </div>
            <button onClick={loadFiles} className={`p-2 hover:bg-couleur1/10 rounded-full text-couleur1 transition-all ${loading ? 'animate-spin' : ''}`}>
                <RefreshCw size={16} />
            </button>
        </div>
    </>
}