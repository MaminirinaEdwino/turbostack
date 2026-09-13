/* eslint-disable no-unused-vars */
import { MousePointer2, Copy, ClipboardPaste, LoaderCircle, Tablet, Computer, Smartphone } from "lucide-react";
import { BLOCK_TYPES, GROUP_LIST, GROUP_LIST_ICON, STYLE_CONTROLS, TAG_STYLE_GROUPS } from "../defaultVar";
import { parseStyles, touppertemplatevar } from "../utilsFunc";
import { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { useSelector } from "react-redux";
import { GoApp } from "../../../../services/bridge";

export default function HtmlPropertiesTab({
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
                    <div className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Tag Type</label>
                            <select
                                className="bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                value={currentActiveBlock.tag}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { tag: e.target.value })}
                            >
                                {BLOCK_TYPES.map((type) => (
                                    <option key={type.tag} value={type.tag}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">
                                Element data id
                            </label>

                            <div className="grid grid-cols-1 justify-center overflow-y-scroll max-h-50">
                                <input
                                    className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                    type="text"
                                    placeholder="Element ID"
                                    value={currentActiveBlock.id || ""}
                                    onInput={(e) => {
                                        setCurrentActiveBlock(e.target.value)
                                        updateBlock(currentActiveBlock.id, { id: e.target.value })
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">CSS Classes</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="tailwind or custom classes..."
                                value={currentActiveBlock.className || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { className: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">HTML ID</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="unique-id-for-element"
                                value={currentActiveBlock.htmlId || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { htmlId: e.target.value })}
                            />
                        </div>
                        {currentActiveBlock.tag == "label" && <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">For #id</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="id"
                                value={currentActiveBlock.for || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { for: e.target.value })}
                            />
                        </div>}

                            
                        
                    </div>
                    {currentActiveBlock.tag === "input" && (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="placeholder" className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Placeholder</label>
                                <input className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all" type="text" name="" id="placeholder" placeholder="placeholder" onChange={(e) => updateBlock(currentActiveBlock.id, { placeholder: e.target.value })} value={currentActiveBlock.placeholder || ""} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="inputType" className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Input Type</label>
                                <select className="bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all" name="" id="inputType" onChange={(e) => updateBlock(currentActiveBlock.id, { inputType: e.target.value })} value={currentActiveBlock.inputType}>
                                    <option value="text">text</option>
                                    <option value="number">number</option>
                                    <option value="email">email</option>
                                    <option value="password">password</option>
                                    <option value="reset">reset</option>
                                    <option value="submit">submit</option>
                                    <option value="radio">radio</option>
                                    <option value="checkbox">checkbox</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {currentActiveBlock.tag === 'a' && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Link target</label>
                            <select
                                className="bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                value={availablePages.some(p => p.uri === currentActiveBlock.href) ? currentActiveBlock.href : "custom"}
                                onChange={(e) => {
                                    if (e.target.value !== "custom") {
                                        updateBlock(currentActiveBlock.id, { href: e.target.value });
                                    }
                                }}
                            >
                                <option value="custom">-- Custom Link --</option>
                                {projectType == "static" && availablePages.map(page => (
                                    <option key={page.ur + page.nom} value={page.uri}>Page: {page.nom} ({page.uri})</option>
                                ))}
                                {projectType == "webapp" && uriList.map(page => (
                                    <option key={page} value={page}>{page}</option>
                                ))}

                            </select>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="URL ..."
                                value={currentActiveBlock.href || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { href: e.target.value })}
                            />
                        </div>
                    )}


                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">
                            {currentActiveBlock.tag == "img" ? "image" : currentActiveBlock.tag == "input" ? "value" : "content"}
                        </label>
                        {!["img", "input"].includes(currentActiveBlock.tag) && <textarea
                            className="w-full bg-couleur3/30 dark:bg-gray-800 p-4 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans leading-relaxed min-h-37.5 focus:ring-2 ring-couleur1/20 transition-all"
                            value={currentActiveBlock.content}
                            onChange={(e) => {
                                updateBlock(currentActiveBlock.id, { content: e.target.value })
                            }}
                            placeholder="Type your content here..."
                        />}
                        <div className="grid grid-cols-2 justify-center overflow-y-scroll max-h-50">
                            {currentActiveBlock.tag == "img" && asset.map(image => <div>
                                <img src={image.base_64_image} alt={image.file_name} title={image.file_name} className=" h-20" onClick={(e) => updateBlock(currentActiveBlock.id, { content: e.target.src })} />
                                <span className="text-xs">{image.file_name}</span>
                            </div>)}
                        </div>
                        {currentActiveBlock.tag == "input" && <>
                            <input
                                list="model-element-list"
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="Value . . ."
                                value={currentActiveBlock.value || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { value: e.target.value })}
                            />
                        </>}
                        <datalist id="model-element-list">
                            {model.map(mdl => <>
                                <optgroup label={mdl.nom}>
                                    {mdl.champs.map(field => <option>{touppertemplatevar(field.nom)}</option>)}
                                </optgroup>
                                <optgroup label={mdl.nom}>
                                    {mdl.champs.map(field => <option>{(touppertemplatevar(mdl.nom) + touppertemplatevar(field.nom)).replaceAll(" }}{{ ", "")}</option>)}
                                </optgroup>
                            </>)}
                        </datalist>
                        {currentActiveBlock.tag == "input" && <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Input name</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="Name . . ."
                                value={currentActiveBlock.name || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { name: e.target.value })}
                            />
                        </div>}
                        {currentActiveBlock.tag == "input" && currentActiveBlock.inputType == "checkbox" && <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">password toggle</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="checkbox"
                                placeholder="Name . . ."
                                checked={currentActiveBlock.passwordViewToggler ? true : false}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { passwordViewToggler: e.target.checked })}
                            />
                        </div>}
                        {currentActiveBlock.tag == "input" && currentActiveBlock.passwordViewToggler && <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Targeted Password</label>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="id"
                                value={currentActiveBlock.targetedPassword || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { targetedPassword: e.target.value })}
                            />
                        </div>}
                        {currentActiveBlock.tag == "form" && <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Form target</label>

                            <select
                                className="bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                value={availablePages.some(p => p.uri === currentActiveBlock.href) ? currentActiveBlock.href : "custom"}
                                onChange={(e) => {
                                    if (e.target.value !== "custom") {
                                        updateBlock(currentActiveBlock.id, { action: e.target.value });
                                    }
                                }}
                            >
                                <option value="custom">-- Custom Link --</option>
                                {projectType == "static" && availablePages.map(page => (
                                    <option key={page.uri + "form"} value={page.uri}>Page: {page.nom} ({page.uri})</option>
                                ))}
                                {projectType == "webapp" && uriList.map(page => (
                                    <option key={page + "form"} value={page}>{page}</option>
                                ))}

                            </select>
                            <input
                                className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                type="text"
                                placeholder="URI . . ."
                                value={currentActiveBlock.action || ""}
                                onChange={(e) => updateBlock(currentActiveBlock.id, { action: e.target.value })}
                            />
                        </div>}
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