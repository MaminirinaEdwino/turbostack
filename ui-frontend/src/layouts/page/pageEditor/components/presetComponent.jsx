export default function PresetComponent({ ctrl, handleStyleChange, currentValue }) {
    return <div className="flex flex-wrap gap-1">
        {ctrl.presetType == "color" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " border-2 border-couleur2")} style={{ backgroundImage: opt }} onClick={() => handleStyleChange(ctrl.prop, opt)}>
        </button>)}

        {ctrl.presetType == "box-shadow" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " bg-couleur2/20")} style={{ boxShadow: opt }} onClick={() => handleStyleChange(ctrl.prop, opt)}>
        </button>)}
    </div>
}