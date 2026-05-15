import React, { useState, useEffect, useMemo } from "react";
import {
    Type, Image as ImageIcon, Trash2, Settings2,
    MousePointer2, Layers, GripVertical, Globe, PlusSquare
} from "lucide-react";
import { STYLE_CONTROLS, BLOCK_TYPES, TAG_STYLE_GROUPS } from "./defaultVar";
import { parseStyles } from './utilsFunc';
import { stringifyStyles } from './utilsFunc';
import Block from "./components/block";
import AddChild from "./components/addChild";
import DeleteBlock from "./components/deleteBlock";
import ChangeTabBtn from "./components/changeTabBtn";
import BlockTab from "./components/blockTab";
import GlobalTab from "./components/globalTab";


export default function VisualEditor({ content, pageStyles = "", onPageStylesChange, onChange, availablePages = [] }) {
    const [blocks, setBlocks] = useState([]);
    const [activeBlock, setActiveBlock] = useState(null);
    const [activeTab, setActiveTab] = useState("blocks"); // "blocks" or "props"
    const [draggedId, setDraggedId] = useState(null);
    const [selectedGlobalTag, setSelectedGlobalTag] = useState("body");

    const availableSelectors = useMemo(() => {
        const tags = new Set(["body"]);
        const classes = new Set();
        const ids = new Set();

        const collect = (list) => {
            list.forEach(b => {
                if (TAG_STYLE_GROUPS[b.tag]) tags.add(b.tag);
                if (b.className) b.className.split(/\s+/).filter(Boolean).forEach(cls => classes.add(`.${cls}`));
                if (b.htmlId) ids.add(`#${b.htmlId}`);
                if (b.children) collect(b.children);
            });
        };
        collect(blocks);
        return {
            tags: Array.from(tags),
            classes: Array.from(classes),
            ids: Array.from(ids)
        };
    }, [blocks]);

    // Initialisation unique des blocs à partir du HTML reçu pour éviter les boucles infinies
    useEffect(() => {
        if (!content) return;

        let extracted = [];
        if (Array.isArray(content)) {
            extracted = content;
        } else {
            try {
                // Tente de parser comme JSON (pour la compatibilité)
                extracted = JSON.parse(content);
                if (!Array.isArray(extracted)) throw new Error();
            } catch (e) {
                // Fallback : parsing HTML si ce n'est pas encore un tableau/JSON
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, "text/html");
                const parseRecursive = (el) => {
                    const clone = el.cloneNode(true);
                    Array.from(clone.children).forEach(c => c.remove());
                    return {
                        id: el.getAttribute("data-block-id") || Math.random().toString(36).substr(2, 9),
                        tag: el.tagName.toLowerCase(),
                        content: clone.innerHTML.trim(),
                        href: el.getAttribute("href") || "",
                        className: el.className,
                        styles: el.getAttribute("style") || "",
                        children: Array.from(el.children).map(child => parseRecursive(child))
                    };
                };
                extracted = Array.from(doc.body.children).map(parseRecursive);
                console.log(e)
            }
        }

        // Comparaison pour éviter de réinitialiser l'état pendant la saisie (perte de focus)
        const currentSerialized = JSON.stringify(blocks);
        const incomingSerialized = JSON.stringify(extracted);

        // On ne met à jour que si les blocs ont réellement changé (ex: changement de page)
        if (blocks.length === 0 || currentSerialized !== incomingSerialized) {
            setBlocks(extracted);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    // Synchronisation vers le parent
    const sync = (currentBlocks) => {
        // On renvoie le tableau directement
        onChange(currentBlocks);
    };

    const selectBlock = (id) => {
        setActiveBlock(id);
        setActiveTab("props");
    };

    // Gestion du Drag and Drop
    const handleDragStart = (e, id) => {
        setDraggedId(id);
        // Stocker l'index dans le dataTransfer pour une récupération fiable au drop
        e.dataTransfer.setData("sourceId", id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const findBlock = (list, id) => {
        for (const b of list) {
            if (b.id === id) return b;
            if (b.children) {
                const found = findBlock(b.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData("sourceId");

        if (!sourceId || sourceId === targetId) return;

        const findAndRemove = (list) => {
            let foundBlock = null;
            const newList = list.filter(b => {
                if (b.id === sourceId) {
                    foundBlock = b;
                    return false;
                }
                return true;
            }).map(b => {
                if (b.children && b.children.length > 0) {
                    const [subList, subFound] = findAndRemove(b.children);
                    if (subFound) foundBlock = subFound;
                    return { ...b, children: subList };
                }
                return b;
            });
            return [newList, foundBlock];
        };

        const [listWithoutSource, blockToMove] = findAndRemove(blocks);

        // Empêcher de glisser un parent dans son propre enfant (ou si source non trouvée)
        if (!blockToMove || !findBlock(listWithoutSource, targetId)) {
            setDraggedId(null);
            return;
        }

        const insertAtTarget = (list) => {
            const index = list.findIndex(b => b.id === targetId);
            if (index !== -1) {
                const newList = [...list];
                newList.splice(index, 0, blockToMove);
                return newList;
            }
            return list.map(b => ({
                ...b,
                children: b.children ? insertAtTarget(b.children) : []
            }));
        };

        const updated = insertAtTarget(listWithoutSource);
        setBlocks(updated);
        sync(updated);
        setDraggedId(null);
    };

    const updateBlock = (id, fields) => {
        const updateTree = (list) => {
            return list.map(b => {
                if (b.id === id) return { ...b, ...fields };
                if (b.children) return { ...b, children: updateTree(b.children) };
                return b;
            });
        };
        const updated = updateTree(blocks);
        setBlocks(updated);
        sync(updated);
    };

    const removeBlock = (id) => {
        const removeFromTree = (list) => {
            return list.filter(b => b.id !== id).map(b => {
                if (b.children) return { ...b, children: removeFromTree(b.children) };
                return b;
            });
        };
        const updated = removeFromTree(blocks);
        setBlocks(updated);
        sync(updated);
        if (activeBlock === id) {
            setActiveBlock(null);
            setActiveTab("blocks");
        }
    };

    const addBlock = (type) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newBlock = {
            id,
            tag: type.tag,
            content: type.defaultContent,
            href: type.defaultHref || "",
            className: "",
            styles: "",
            children: []
        };
        const updated = [...blocks, newBlock];
        setBlocks(updated);
        sync(updated);
        setActiveBlock(id);
        setActiveTab("props");
    };

    const addChild = (parentId, type) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newBlock = {
            id,
            tag: type.tag,
            content: type.defaultContent,
            href: type.defaultHref || "",
            className: "",
            styles: "",
            htmlId: "", // Initialisation de la nouvelle propriété htmlId
            children: []
        };
        const updateTree = (list) => {
            return list.map(b => {
                if (b.id === parentId) return { ...b, children: [...(b.children || []), newBlock] };
                if (b.children) return { ...b, children: updateTree(b.children) };
                return b;
            });
        };
        const updated = updateTree(blocks);
        setBlocks(updated);
        sync(updated);
        setActiveBlock(id);
        setActiveTab("props");
    };

    const getIconForTag = (tag) => {
        const type = BLOCK_TYPES.find(t => t.tag === tag);
        return type ? type.icon : <Type size={14} />;
    };

    const currentActiveBlock = findBlock(blocks, activeBlock);

    const handleStyleChange = (prop, value) => {
        const styles = parseStyles(currentActiveBlock.styles);
        const updated = { ...styles, [prop]: value };
        updateBlock(currentActiveBlock.id, { styles: stringifyStyles(updated) });
    };

    const handlePageStyleChange = (prop, value) => {
        let allStyles = {};
        try {
            allStyles = JSON.parse(pageStyles || "{}");
        } catch (e) {
            console.log(e)
            allStyles = { body: pageStyles };
        }

        const currentTagStyles = parseStyles(allStyles[selectedGlobalTag] || "");
        const updatedTagStyles = { ...currentTagStyles, [prop]: value };
        allStyles[selectedGlobalTag] = stringifyStyles(updatedTagStyles);

        onPageStylesChange(JSON.stringify(allStyles));
    };

    const renderBlocksList = (blocksList, level = 0) => {
        return blocksList.map((block, index) => (
            <React.Fragment key={block.id}>
                <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, block.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, block.id)}
                    onDragEnd={() => setDraggedId(null)}
                    style={{ marginLeft: `${level * 16}px` }}
                    className={`group p-3 rounded-2xl border transition-all cursor-pointer mb-2 ${draggedId === block.id ? "opacity-20 border-dashed border-couleur1 scale-95" : ""
                        } ${activeBlock === block.id ? "bg-white dark:bg-gray-900 border-couleur1 shadow-md ring-4 ring-couleur1/5" : "bg-white/50 dark:bg-gray-900/40 border-transparent hover:border-couleur1/20"}`}
                    onClick={() => selectBlock(block.id)}
                >
                    <div className="flex justify-between items-center">

                        <Block index={index} getIconForTag={getIconForTag} block={block} />
                        <div className="flex items-center gap-1">
                            <AddChild block={block} addChild={addChild}/>
                            <DeleteBlock block={block} removeBlock={removeBlock}/>
                        </div>
                    </div>
                </div>
                {block.children && block.children.length > 0 && renderBlocksList(block.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"> 
            <div className="flex bg-white/50 dark:bg-gray-800 p-1 rounded-xl border border-couleur1/10 shadow-sm">
                <ChangeTabBtn icon={<Layers size={14} /> } value={"Structure"} setter={setActiveTab} activeTab={activeTab} newVal={'blocks'}/>
                <ChangeTabBtn icon={<Globe size={14} /> } value={"Global"} setter={setActiveTab} activeTab={activeTab} newVal={"global"}/>
                <ChangeTabBtn icon={<Settings2 size={14} /> } value={"Properties"} setter={setActiveTab} activeTab={activeTab} newVal={"properties"}/>
            </div>

            {activeTab === "blocks" ? (
                <BlockTab blocks={blocks} renderBlocksList={renderBlocksList} addBlock={addBlock}/>
            ) : activeTab === "global" ? (
                <GlobalTab availableSelectors={availableSelectors} setSelectedGlobalTag={setSelectedGlobalTag} handlePageStyleChange={handlePageStyleChange} pageStyles={pageStyles} selectedGlobalTag={selectedGlobalTag}/>
            ) : (
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

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>
                                    <div className="grid grid-cols-2 gap-3 bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                                        {STYLE_CONTROLS.filter(ctrl => (TAG_STYLE_GROUPS[currentActiveBlock.tag] || []).includes(ctrl.prop)).map((ctrl) => {
                                            const styles = parseStyles(currentActiveBlock.styles);
                                            let currentValue = styles[ctrl.prop] || "";

                                            return (
                                                <div key={ctrl.prop} className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label}</span>
                                                    {ctrl.type === "number" ? (
                                                        <div className="flex gap-1">
                                                            {/* Input numérique pour la valeur */}
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white dark:bg-gray-900 px-2 py-1.5 rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all"
                                                                placeholder="e.g. 10"
                                                                value={currentValue === "auto" ? "" : (parseFloat(currentValue) || "")}
                                                                disabled={currentValue === "auto"}
                                                                onChange={(e) => {
                                                                    const numValue = e.target.value;
                                                                    let unit = currentValue.match(/[a-zA-Z%]+$/)?.[0] || "px";
                                                                    if (unit === "auto") unit = "px";
                                                                    handleStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${unit}`);
                                                                }}
                                                            />
                                                            {/* Sélecteur d'unité */}
                                                            <select
                                                                className="bg-white dark:bg-gray-900 px-2 py-1.5 rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all"
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
                                                                <option value="px">px</option>
                                                                <option value="em">em</option>
                                                                <option value="%">%</option>
                                                                <option value="rem">rem</option>
                                                                {["margin", "width", "height"].includes(ctrl.prop) && <option value="auto">auto</option>}
                                                            </select>
                                                        </div>
                                                    ) : ctrl.type === "select" ? (
                                                        <select
                                                            className="w-full bg-white dark:bg-gray-900 px-2 py-1.5 rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all"
                                                            value={currentValue}
                                                            onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                        >
                                                            <option value="">--</option>
                                                            {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={ctrl.type}
                                                            className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'} rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all`}
                                                            placeholder={ctrl.placeholder}
                                                            // For color inputs, ensure value is always a string, even if empty
                                                            value={currentValue}
                                                            onChange={(e) => handleStyleChange(ctrl.prop, e.target.value)}
                                                        />)
                                                    }
                                                </div>
                                            )
                                        })
                                        }
                                    </div>


                                </div>
                            </div>

                            {currentActiveBlock.tag === 'a' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Destination du lien</label>
                                    <select
                                        className="bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                                        value={availablePages.some(p => p.uri === currentActiveBlock.href) ? currentActiveBlock.href : "custom"}
                                        onChange={(e) => {
                                            if (e.target.value !== "custom") {
                                                updateBlock(currentActiveBlock.id, { href: e.target.value });
                                            }
                                        }}
                                    >
                                        <option value="custom">-- Lien personnalisé --</option>
                                        {availablePages.map(page => (
                                            <option key={page.uri} value={page.uri}>Page: {page.nom} ({page.uri})</option>
                                        ))}
                                    </select>
                                    <input
                                        className="w-full bg-couleur3/30 dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans focus:ring-2 ring-couleur1/20 transition-all"
                                        type="text"
                                        placeholder="URL externe ou chemin..."
                                        value={currentActiveBlock.href || ""}
                                        onChange={(e) => updateBlock(currentActiveBlock.id, { href: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Content Content</label>
                                <textarea
                                    className="w-full bg-couleur3/30 dark:bg-gray-800 p-4 rounded-xl border border-couleur1/10 outline-none text-sm dark:text-gray-200 font-sans leading-relaxed min-h-37.5 focus:ring-2 ring-couleur1/20 transition-all"
                                    value={currentActiveBlock.content}
                                    onChange={(e) => updateBlock(currentActiveBlock.id, { content: e.target.value })}
                                    placeholder="Type your content here..."
                                />
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
            )
            }
        </div >
    );
}