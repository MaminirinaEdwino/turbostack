/* eslint-disable no-unused-vars */
import { MousePointer2, Copy, ClipboardPaste, LoaderCircle, Tablet, Computer, Smartphone } from "lucide-react";
import { BLOCK_TYPES, GROUP_LIST, GROUP_LIST_ICON, STYLE_CONTROLS, TAG_STYLE_GROUPS } from "../defaultVar";
import { parseStyles, touppertemplatevar } from "../utilsFunc";
import { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { useSelector } from "react-redux";
import { GoApp } from "../../../../services/bridge";

export default function PropertiesTab({
    currentActiveBlock, getIconForTag, updateBlock, handleStyleChange, availablePages,
    activeViewport = "desktop", onCopyStyle, onPasteStyle, hasCopiedStyle, styleToTablet, styleToModbile, styleToDesktop, setCurrentActiveBlock, activePage
}) {
    const [activeGroup, setActiveGroup] = useState(GROUP_LIST[0])
    const projectName = useSelector(state => state.app.actualProject)
    const [model, setmodel] = useState([])
    const [asset, setAsset] = useState([])
    const [uriList, setUriList] = useState([])
    const [projectType, setProjectType] = useState("static")
    useEffect(() => {
        const loadAsset = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            setAsset(res.assets)
        }
        loadAsset()
    }, [projectName])
    useEffect(() => {
        const loadAsset = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            setProjectType(res.type)
        }
        loadAsset()
    }, [projectName])
    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            res != undefined && res?.rest_api?.endpoints?.map(ep => {
                if (ep.return_page === activePage.nom) {
                    setmodel([...model, ...ep.return_content])
                }
            })
        }
        loadProject()
    }, [activePage.nom, model, projectName])
    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            let tmp = []
            res?.rest_api?.endpoints?.map(ep => {
                tmp.push(ep.uri)
            })
            setUriList(tmp)
        }
        loadProject()
    }, [projectName])
    // Extraction intelligente des styles selon le viewport
    const getStylesForViewport = () => {
        if (!currentActiveBlock?.styles) return {};
        try {
            if (typeof currentActiveBlock.styles === 'string' && currentActiveBlock.styles.trim().startsWith('{')) {
                const parsed = JSON.parse(currentActiveBlock.styles);
                return parsed[activeViewport] || parsed.desktop || {};
            }
            // Fallback pour l'ancien format string
            return parseStyles(currentActiveBlock.styles);
        } catch (e) {
            return {};
        }
    };

    const currentStyles = getStylesForViewport();

    return <>
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">

            {currentActiveBlock ? (
                <div className="space-y-6">

                    <div className="flex items-center gap-3 p-4 bg-couleur1/5 rounded-2xl border border-couleur1/10">
                        <div className="p-3 bg-couleur1 text-white rounded-xl shadow-sm">
                            {getIconForTag(currentActiveBlock.tag)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-couleur1 opacity-40">Active Block Settings</p>
                            <p className="text-sm font-bold text-couleur1 dark:text-gray-200">{currentActiveBlock.tag.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="space-y-5">

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>

                                <div className="flex gap-2">
                                    <button onClick={onCopyStyle} className="p-1 text-couleur1/40 hover:text-couleur1 transition-all" title="Copier le style">
                                        <Copy size={14} />
                                    </button>
                                    <button onClick={onPasteStyle} disabled={!hasCopiedStyle} className={`p-1 transition-all ${hasCopiedStyle ? 'text-couleur1/40 hover:text-couleur1' : 'opacity-10 cursor-not-allowed'}`} title="Coller le style">
                                        <ClipboardPaste size={14} />
                                    </button>
                                    {
                                        activeViewport != "tablet" && <button onClick={styleToTablet} className={`p-1 transition-all text-couleur1/40 hover:text-couleur1`} title="Copy style to tablet version">
                                            <Tablet size={14} />
                                        </button>
                                    }
                                    {activeViewport != "desktop" && <button onClick={styleToDesktop} className={`p-1 transition-all text-couleur1/40 hover:text-couleur1`} title="Copy style to desktop version">
                                        <Computer size={14} />
                                    </button>}
                                    {activeViewport != "mobile" && <button onClick={styleToModbile} className={`p-1 transition-all text-couleur1/40 hover:text-couleur1`} title="Copy style to mobile version">
                                        <Smartphone size={14} />
                                    </button>}
                                </div>
                            </div>
                            <div className="flex gap-2 mx-1">
                                {GROUP_LIST.map(group => <button className={`flex items-center transition-all duration-250 gap-1 ${activeGroup == group && "bg-couleur1 p-1 text-couleur3 rounded text-lg "} `} title={group+" tab"} onClick={() => setActiveGroup(group)}>{GROUP_LIST_ICON[group]}</button>)}
                            </div>
                            <div className=" gap-3 bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                                {GROUP_LIST.map(group => <div className="mb-2">
                                    {group == activeGroup && <h3 className={"flex items-center gap-1 text-couleur6 my-1 transition-all  duration-200 ease-in-out " + (activeGroup != group && "text-xs")} onClick={() => setActiveGroup(group)}> {GROUP_LIST_ICON[group]} {group}</h3>}
                                    <div className={"grid grid-cols-2 transition-all duration-150 delay-150 gap-2 p-1" + (activeGroup != group && " hidden")}>

                                        {STYLE_CONTROLS.filter((ctrl) => (TAG_STYLE_GROUPS[currentActiveBlock.tag] || []).includes(ctrl.group)).map((ctrl) => {
                                            if (group == ctrl.group) {
                                                let currentValue = currentStyles[ctrl.prop] || "";

                                                if (ctrl.conditions && ctrl.conditions.length > 0 && ctrl.conditions[1] == currentStyles[ctrl.conditions[0]]) {
                                                    return (
                                                        <div key={ctrl.prop} className="flex flex-col gap-1 justify-between my-1">
                                                            <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label} {ctrl.reset && <>
                                                                <button onClick={() => handleStyleChange(ctrl.prop, ctrl.reset)}><LoaderCircle size={10} /></button>
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
                                                                            handleStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${ctrl.unite ? unit : ""}`);
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

                                                                    </select>}

                                                                </div>
                                                            ) : ctrl.type === "select" ? (
                                                                <select

                                                                    className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  text-xs outline-none focus:ring-0 ring-couleur1/20 transition-all border-b  border-couleur2  appearance-none"
                                                                    value={currentValue}
                                                                    onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                                >
                                                                    <option value="">--</option>
                                                                    {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    key={ctrl.type + ctrl.prop}
                                                                    type={ctrl.type}
                                                                    className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'}  border-b text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all   border-couleur2  appearance-none shad`}
                                                                    placeholder={ctrl.placeholder}
                                                                    // For color inputs, ensure value is always a string, even if empty
                                                                    value={currentValue}
                                                                    onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                                />)
                                                            }

                                                        </div>
                                                    )
                                                } if (ctrl.conditions.length == 0) {
                                                    return (
                                                        <div>

                                                            <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label} {ctrl.reset && <button onClick={() => handleStyleChange(ctrl.prop, ctrl.reset)}><BiReset size={10} /></button>} </span>
                                                            {ctrl.type === "number" ? (
                                                                <div className="flex gap-1">
                                                                    {/* Input numérique pour la valeur */}
                                                                    <input
                                                                        key={"condition" + ctrl.prop + ctrl.conditions}
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
                                                                    {/* Sélecteur d'unité */}
                                                                    {ctrl.unite && <select
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
                                                                    </select>}
                                                                </div>
                                                            ) : ctrl.type === "select" ? (
                                                                <select
                                                                    className="w-full bg-white dark:bg-gray-900 px-2 py-1.5  text-xs outline-none focus:ring-0 ring-couleur1/20 transition-all border-b  border-couleur2  appearance-none"
                                                                    value={currentValue}
                                                                    onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                                >
                                                                    <option value="">--</option>
                                                                    {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    type={ctrl.type}
                                                                    className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'}  border-b text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all   border-couleur2  appearance-none shad`}
                                                                    placeholder={ctrl.placeholder}
                                                                    // For color inputs, ensure value is always a string, even if empty
                                                                    value={currentValue}
                                                                    onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                                />)
                                                            }
                                                        </div>
                                                    )
                                                }
                                            }
                                        })
                                        }
                                    </div>
                                </div>)}
                            </div>


                        </div>
                    </div>
                </div>

            ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-couleur1 text-center">
                    <MousePointer2 size={48} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Select a block in the<br />Structure tab to edit
                    </p>
                </div>
            )}
        </div>
    </>
}