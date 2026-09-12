export default function NumberTypePropInput({ ctrl, group, currentValue, handleStyleChange }) {
    return <input
        key={ctrl.prop + group}
        type="number"
        className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  border-b border-couleur2 ring-couleur1/20 transition-all appearance-none outline-0"
        placeholder="e.g. 10"
        value={currentValue === "auto" ? "" : (parseFloat(currentValue) || "")}
        disabled={currentValue === "auto"}
        onChange={(e) => {
            const numValue = e.target.value;
            let unit = currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px";
            if (unit === "auto") unit = "px";
            handleStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${ctrl.unite ? unit : ""}`);
        }}
    />
}