import FieldToggleRow from "./fieldToggleRow";

export default function NonCollapsedController({activeController, toggleBinding, updateController, selectedIndex, ep}) {
    return <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
        {(() => {
            const fields = [];
            ep.model?.forEach(m => m.champs?.forEach(f => fields.push(f.nom)));
            ep.params?.forEach(p => fields.push(p));
            const uniqueFields = [...new Set(fields)];

            return uniqueFields.map(fieldNom => {
                const binding = activeController.bindings?.find(b => b.endpoint_nom === ep.nom && b.map_field === fieldNom);
                return (
                    <FieldToggleRow
                        key={fieldNom}
                        fieldNom={fieldNom}
                        isActive={!!binding}
                        binding={binding}
                        onToggle={(checked) => toggleBinding(ep.nom, fieldNom, checked)}
                        onChange={(newVal) => {
                            updateController(selectedIndex, 'bindings', (prev) => {
                                const idx = prev.findIndex(b => b.endpoint_nom === ep.nom && b.map_field === fieldNom);
                                const next = [...prev];
                                next[idx] = newVal;
                                return next;
                            });
                        }}
                    />
                );
            });
        })()}
    </div>
}