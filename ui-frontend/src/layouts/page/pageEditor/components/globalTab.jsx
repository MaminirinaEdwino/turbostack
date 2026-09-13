/* eslint-disable no-unused-vars */
import { Globe } from "lucide-react";
import { GROUP_LIST, GROUP_LIST_ICON, STYLE_CONTROLS, TAG_STYLE_GROUPS } from "../defaultVar";
import { parseStyles } from "../utilsFunc";
import { useState } from "react";
import { BiReset } from "react-icons/bi";

export default function GlobalTab({
    selectedGlobalTag, setSelectedGlobalTag, availableSelectors, pageStyles, handlePageStyleChange, activeViewport = "desktop"
}) {
    const [activeGroup, setActiveGroup] = useState(GROUP_LIST[0])
    return <>
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 ">
            

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Target</label>
                <select
                    className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                    value={selectedGlobalTag}
                    onChange={(e) => setSelectedGlobalTag(e.target.value)}
                >
                    <optgroup label="Balises">
                        {availableSelectors.tags.map(tag => (<>
                            <option key={tag} value={tag}>{tag === 'body' ? 'body' : `${tag}`}</option>
                            <option key={tag} value={tag + ":hover"}>{tag === 'body' ? 'body:hover' : `${tag}:hover`}</option>
                        </>
                        ))}
                    </optgroup>
                    {availableSelectors.classes.length > 0 && (
                        <optgroup label="Classes CSS">
                            {availableSelectors.classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </optgroup>
                    )}
                    {availableSelectors.ids.length > 0 && (
                        <optgroup label="IDs HTML">
                            {availableSelectors.ids.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>
                <div className="flex gap-2 mx-1">
                    {GROUP_LIST.map(group => <button className={`flex items-center transition-all duration-250 gap-1 ${activeGroup == group && "bg-couleur1 p-1 text-couleur3 rounded text-lg scale-125"} `} title={group + " tab"} onClick={() => setActiveGroup(group)}>{GROUP_LIST_ICON[group]}</button>)}
                </div>
                <div className=" bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                    {GROUP_LIST.map((group) => <div className="mb-2">
                        {group == activeGroup && <h3 className={"flex items-center gap-1 text-couleur6 my-1 transition-all  duration-200 ease-in-out " + (activeGroup != group && "text-xs")} onClick={() => setActiveGroup(group)}> {GROUP_LIST_ICON[group]} {group}</h3>}
                        <div className={"grid grid-cols-2 transition-all duration-150 delay-150 gap-2 p-1" + (activeGroup != group && " hidden")}>
                            {STYLE_CONTROLS.filter(ctrl => {
                                const isCustomSelector = selectedGlobalTag.startsWith('.') || selectedGlobalTag.startsWith('#');
                                const groupKey = isCustomSelector ? "generic" : (selectedGlobalTag === "body" ? "page" : selectedGlobalTag);
                                return (TAG_STYLE_GROUPS[groupKey] || []).includes(ctrl.group);
                            }).map((ctrl) => {
                                if (ctrl.group == group) {
                                    let stylesObj = {};
                                    try {
                                        stylesObj = JSON.parse(pageStyles || "{}");
                                    } catch (e) {
                                        stylesObj = { body: pageStyles };
                                    }

                                    // Récupération selon le viewport actif dans le JSON global
                                    const vpStyles = stylesObj[activeViewport] || (activeViewport === 'desktop' ? stylesObj : {});
                                    const styles = parseStyles(vpStyles[selectedGlobalTag] || "");

                                    let currentValue = styles[ctrl.prop] || "";

                                    if (ctrl.conditions && ctrl.conditions.length > 0 && ctrl.conditions[1] == currentValue[ctrl.conditions[0]]) {
                                        return (
                                            <div key={ctrl.prop} className={"flex flex-col gap-1 justify-between  my-1 " + (ctrl.grid && ctrl.grid)}>
                                                <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label} {ctrl.reset && <>
                                                    <button onClick={() => handlePageStyleChange(ctrl.prop, ctrl.reset)}><LoaderCircle size={10} /></button>
                                                </>} </span>
                                                {ctrl.type === "number" ? (
                                                    <div className="flex gap-1">
                                                        {/* Input numérique pour la valeur */}
                                                        <input
                                                            key={ctrl.prop}
                                                            type="number"
                                                            className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  border-b border-couleur2 ring-couleur1/20 transition-all appearance-none outline-0"
                                                            placeholder="e.g. 10"
                                                            value={currentValue === "auto" ? "" : (parseFloat(currentValue) || "")}
                                                            disabled={currentValue === "auto"}
                                                            onChange={(e) => {
                                                                const numValue = e.target.value;
                                                                let unit = currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px";
                                                                if (unit === "auto") unit = "px";
                                                                handlePageStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${ctrl.unite ? unit : ""}`);
                                                            }}
                                                        />
                                                        {/* Sélecteur d'unité */}
                                                        {ctrl.unite && <select
                                                            key={ctrl.prop + ctrl.unit}
                                                            className="bg-white dark:bg-gray-900 px-2 py-1.5 border-b  border-couleur2 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all appearance-none min-w-10 outline-0"
                                                            value={currentValue === "auto" ? "auto" : (currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px")}
                                                            onChange={(e) => {
                                                                const newUnit = e.target.value;
                                                                if (newUnit === "auto") {
                                                                    handlePageStyleChange(ctrl.prop, "auto");
                                                                } else {
                                                                    const numValue = parseFloat(currentValue) || 0;
                                                                    handlePageStyleChange(ctrl.prop, `${numValue}${newUnit}`);
                                                                }
                                                            }}
                                                        >
                                                            {ctrl.unite && <>
                                                                {ctrl.unite.map(unite => <option value={unite}>{unite}</option>)}
                                                            </>}

                                                        </select>}

                                                    </div>
                                                ) : ctrl.type === "select" ? (
                                                    !ctrl.buttoned ? <select
                                                        className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  text-xs outline-none focus:ring-0 ring-couleur1/20 transition-all border-b  border-couleur2  appearance-none"
                                                        value={currentValue}
                                                        onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                                    >
                                                        <option value="">--</option>
                                                        {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select> : <div className="flex gap-2">
                                                        {ctrl.options.map((opt, idx) => <button className={"flex text-xs gap-1 p-1 rounded transition-all duration-150 " + (currentValue == opt && "bg-couleur1 text-couleur3 ")} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}> {ctrl.optionIcon[idx]} {opt} </button>)}
                                                    </div>
                                                ) : ctrl.type == "preset" ? <div className="flex flex-wrap gap-1">
                                                    {ctrl.presetType == "color" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " border-2 border-couleur2")} style={{ backgroundImage: opt }} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}>

                                                    </button>)}
                                                    {ctrl.presetType == "box-shadow" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " bg-couleur2/20")} style={{ boxShadow: opt }} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}>
                                                    </button>)}
                                                </div> : ctrl.type == "separator" ? "" : (
                                                    <input
                                                        key={ctrl.type + ctrl.prop}
                                                        type={ctrl.type}
                                                        className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'}  border-b text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all   border-couleur2  appearance-none shad`}
                                                        placeholder={ctrl.placeholder}
                                                        // For color inputs, ensure value is always a string, even if empty
                                                        value={currentValue}
                                                        onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                                    />)
                                                }

                                            </div>
                                        )
                                    } if (ctrl.conditions.length == 0) {
                                        return (
                                            <div className={(ctrl.grid && ctrl.grid)}>

                                                <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label} {ctrl.reset && <button onClick={() => handlePageStyleChange(ctrl.prop, ctrl.reset)}><BiReset size={10} /></button>} </span>
                                                {ctrl.type === "number" ? (
                                                    <div className="flex gap-1">
                                                        {/* Input numérique pour la valeur */}
                                                        <input
                                                            key={"condition" + ctrl.prop + ctrl.conditions}
                                                            type="number"
                                                            className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  border-b border-couleur2 ring-couleur1/20 transition-all appearance-none outline-0 text-sm"
                                                            placeholder="e.g. 10"
                                                            value={currentValue === "auto" ? "" : (parseFloat(currentValue) || "")}
                                                            disabled={currentValue === "auto"}
                                                            onChange={(e) => {
                                                                const numValue = e.target.value;
                                                                let unit = currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px";
                                                                if (unit === "auto") unit = "px";
                                                                handlePageStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${ctrl.unite ? unit : ""}`);
                                                            }}
                                                        />
                                                        {/* Sélecteur d'unité */}
                                                        {ctrl.unite && <select
                                                            className="bg-white dark:bg-gray-900 px-1 py-1.5 border-b  border-couleur2 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all appearance-none min-w-6 outline-0"
                                                            value={currentValue === "auto" ? "auto" : (currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px")}
                                                            onChange={(e) => {
                                                                const newUnit = e.target.value;
                                                                if (newUnit === "auto") {
                                                                    handlePageStyleChange(ctrl.prop, "auto");
                                                                } else {
                                                                    const numValue = parseFloat(currentValue) || 0;
                                                                    handlePageStyleChange(ctrl.prop, `${numValue}${newUnit}`);
                                                                }
                                                            }}
                                                        >
                                                            {ctrl.unite && <>
                                                                {ctrl.unite.map(unite => <option value={unite}>{unite}</option>)}
                                                            </>}
                                                        </select>}

                                                    </div>
                                                ) : ctrl.type === "select" ? (
                                                    !ctrl.buttoned ? <select
                                                        className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  text-xs outline-none focus:ring-0 ring-couleur1/20 transition-all border-b  border-couleur2  appearance-none"
                                                        value={currentValue}
                                                        onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                                    >
                                                        <option value="">--</option>
                                                        {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select> : <div className="flex gap-2">
                                                        {ctrl.options.map((opt, idx) => <button className={"flex text-xs gap-1 p-1 rounded transition-all duration-150 " + (currentValue == opt && "bg-couleur1 text-couleur3 ")} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}> {ctrl.optionIcon[idx]} {opt} </button>)}
                                                    </div>
                                                ) : ctrl.type == "preset" ? <div className="flex flex-wrap gap-1">
                                                    {ctrl.presetType == "color" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " border-2 border-couleur2")} style={{ backgroundImage: opt }} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}>

                                                    </button>)}
                                                    {ctrl.presetType == "box-shadow" && ctrl.option.map(opt => <button className={"w-10 h-10 rounded-full " + (currentValue == opt && " bg-couleur2/20")} style={{ boxShadow: opt }} onClick={(e) => handlePageStyleChange(ctrl.prop, opt)}>
                                                    </button>)}
                                                </div> : ctrl.type == "separator" ? "" : (
                                                    <input
                                                        type={ctrl.type}
                                                        className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'}  border-b text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all   border-couleur2  appearance-none shad`}
                                                        placeholder={ctrl.placeholder}
                                                        value={currentValue}
                                                        onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                                    />)
                                                }
                                            </div>
                                        )
                                    }
                                }
                            })}
                        </div>
                    </div>)}

                </div>
            </div>
           
        </div>
    </>
}