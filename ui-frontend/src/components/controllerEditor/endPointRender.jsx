import EndPointDetails from "./endPointDetails";
import EndPointLocalConfig from "./endPointLocalConfig";
import NonCollapsedController from "./nonCollapsedController";
import { Puzzle } from "lucide-react";

export default function EndPointRender({endpoints, activeBindings, toggleGroup, collapsedEndpoints, updateGroupConfig, activeController, toggleBinding, selectedIndex, updateController, generateComponent}) {
    return <div className="space-y-12">
        {endpoints.map((ep) => {
            const bindingsInGroup = activeBindings?.filter(b => b.endpoint_nom === ep.nom) || [];
            const groupTrigger = bindingsInGroup[0]?.trigger || "onLoad";
            const groupAction = bindingsInGroup[0]?.action || "fill_content";

            return (
                <div key={ep.nom} className="space-y-4">
                    <div
                        className="flex items-center justify-between pb-2 border-b border-couleur1/5 cursor-pointer select-none group"
                        onClick={() => toggleGroup(ep.nom)}
                    >
                        <EndPointDetails collapsedEndpoints={collapsedEndpoints} ep={ep}></EndPointDetails>

                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => generateComponent(ep.nom)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-couleur1/5 text-couleur1 rounded-lg hover:bg-couleur1 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider border border-couleur1/10"
                                title="Générer un composant UI basé sur les champs mappés"
                            >
                                <Puzzle size={14} />
                                Generate UI
                            </button>
                            {/* Configuration locale au groupe d'endpoint */}
                            <EndPointLocalConfig ep={ep} groupAction={groupAction} groupTrigger={groupTrigger} updateGroupConfig={updateGroupConfig} ></EndPointLocalConfig>
                        </div>
                    </div>
                    {!collapsedEndpoints[ep.nom] && (
                        <NonCollapsedController activeController={activeController} ep={ep} selectedIndex={selectedIndex} toggleBinding={toggleBinding} updateController={updateController}></NonCollapsedController>
                    )}
                </div>
            );
        })}
    </div>
}