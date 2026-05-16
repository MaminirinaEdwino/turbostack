import EndPointDetails from "./endPointDetails";
import EndPointLocalConfig from "./endPointLocalConfig";
import NonCollapsedController from "./nonCollapsedController";

export default function EndPointRender({endpoints, activeBindings, toggleGroup, collapsedEndpoints, updateGroupConfig, activeController, toggleBinding, selectedIndex, updateController}) {
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

                        {/* Configuration locale au groupe d'endpoint */}
                        <EndPointLocalConfig ep={ep} groupAction={groupAction} groupTrigger={groupTrigger} updateGroupConfig={updateGroupConfig} ></EndPointLocalConfig>
                    </div>
                    {!collapsedEndpoints[ep.nom] && (
                        <NonCollapsedController activeController={activeController} ep={ep} selectedIndex={selectedIndex} toggleBinding={toggleBinding} updateController={updateController}></NonCollapsedController>
                    )}
                </div>
            );
        })}
    </div>
}