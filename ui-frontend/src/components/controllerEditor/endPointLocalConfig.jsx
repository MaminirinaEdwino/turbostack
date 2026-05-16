export default function EndPointLocalConfig({groupAction, groupTrigger, updateGroupConfig, ep}) {
    return <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <select
            value={groupTrigger}
            onChange={(e) => updateGroupConfig(ep.nom, 'trigger', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
        >
            <option value="onLoad">onLoad</option>
            <option value="onClick">onClick</option>
            <option value="onHover">onHover</option>
        </select>
        <select
            value={groupAction}
            onChange={(e) => updateGroupConfig(ep.nom, 'action', e.target.value)}
            className="w-full px-3 p-2 rounded-xl border border-couleur1/10 bg-couleur3/30 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
        >
            <option value="fill_content">Fill</option>
            <option value="set_style">Style</option>
            <option value="redirect">Redirect</option>
        </select>
    </div>
}