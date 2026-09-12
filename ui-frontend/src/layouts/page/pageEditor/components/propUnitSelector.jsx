export default function PropUnitSelector({ ctrl, currentValue, handleStyleChange }) {
    return <select
        key={ctrl.prop + ctrl.unit}
        className="bg-white dark:bg-gray-900 px-2 py-1.5 border-b  border-couleur2 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all appearance-none min-w-10 outline-0"
        value={currentValue === "auto" ? "auto" : (currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px")}
        onChange={(e) => {
            const newUnit = e.target.value;
            if (newUnit === "auto") {
                handleStyleChange(ctrl.prop, "auto");
            } else {
                const numValue = parseFloat(currentValue) || 0;
                handleStyleChange(ctrl.prop, `${numValue}${newUnit}`);
            }
        }}
    >
        {ctrl.unite && <>
            {ctrl.unite.map(unite => <option value={unite}>{unite}</option>)}
        </>}
    </select>
}