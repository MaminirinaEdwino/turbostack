export function SelectTypeNotButtoned({ currentValue, handleStyleChange, ctrl }) {
    return <select
        className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  text-xs outline-none focus:ring-0 ring-couleur1/20 transition-all border-b  border-couleur2  appearance-none"
        value={currentValue}
        onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
    >
        <option value="">--</option>
        {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
}

export function SelectTypeButtoned({ ctrl, handleStyleChange, currentValue }) {
    return <div className="flex gap-2">
        {ctrl.options.map((opt, idx) => <button className={"flex text-xs gap-1 p-1 rounded transition-all duration-150 " + (currentValue == opt && "bg-couleur1 text-couleur3 ")} onClick={() => handleStyleChange(ctrl.prop, opt)}> {ctrl.optionIcon[idx]} {opt} </button>)}
    </div>
}