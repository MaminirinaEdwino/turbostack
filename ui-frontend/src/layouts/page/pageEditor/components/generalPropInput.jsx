export default function GeneralPropInput({ctrl, currentValue, handleStyleChange}) {
    return <input
        type={ctrl.type}
        className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'}  border-b text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all   border-couleur2  appearance-none shad`}
        placeholder={ctrl.placeholder}
        value={currentValue}
        onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
    />
}