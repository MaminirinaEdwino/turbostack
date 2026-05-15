import React, { useState, useEffect, useMemo } from "react";
import {
    Type, Image as ImageIcon, Trash2, Settings2, Copy, ClipboardPaste,
    MousePointer2, Layers, GripVertical, Globe, PlusSquare, Puzzle, Database, Link2, Plus, Unlink, Cpu, ArrowRight
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
import PropertiesTab from "./components/propertieTab";


export default function VisualEditor({
    content,
    pageStyles = "",
    onPageStylesChange,
    onChange,
    availablePages = [],
    availableComponents = [],
    activeBlock,
    setActiveBlock,
    activeTab,
    setActiveTab,
    activeViewport = "desktop",
    allowedTabs = ["blocks", "global", "properties"],
    availableControllers = [],
    currentPageName = "",
    onUpdateControllers,
    showToast
}) {
    const [blocks, setBlocks] = useState([]);
    const [draggedId, setDraggedId] = useState(null);
    const [selectedGlobalTag, setSelectedGlobalTag] = useState("body");
    const [copiedStyle, setCopiedStyle] = useState(null);

    const handleCopyStyle = (styles) => {
        setCopiedStyle(styles);
        if (showToast) showToast("Style copié avec succès !");
    };

    const handlePasteStyle = (id) => {
        if (!copiedStyle) return;
        updateBlock(id, { styles: copiedStyle });
        if (showToast) showToast("Style appliqué !");
    };

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

    // Mapper les bindings par ID d'élément pour un affichage rapide dans la structure
    const bindingsMap = useMemo(() => {
        const map = {};
        availableControllers
            .filter(ctrl => ctrl.page_nom === currentPageName)
            .forEach(ctrl => {
                (ctrl.bindings || []).forEach(binding => {
                    if (binding.id_element) {
                        if (!map[binding.id_element]) map[binding.id_element] = [];
                        map[binding.id_element].push({ ...binding, ctrlName: ctrl.nom });
                    }
                });
            });
        return map;
    }, [availableControllers, currentPageName]);

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
        if (onChange) onChange(currentBlocks);
    };

    const selectBlock = (id) => {
        if (setActiveBlock) setActiveBlock(id);
        if (setActiveTab && allowedTabs.includes("properties")) setActiveTab("properties");
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
            if (setActiveBlock) setActiveBlock(null);
            if (setActiveTab) {
                if (allowedTabs.includes("blocks")) setActiveTab("blocks");
                else if (allowedTabs.includes("global")) setActiveTab("global");
            }
        }
    };

    const addBlock = (type, isComponent = false) => {
        const id = Math.random().toString(36).substr(2, 9);
        let newBlock;

        if (isComponent) {
            newBlock = {
                id,
                tag: "div",
                content: "",
                className: `component-${type.nom?.toLowerCase().replace(/\s+/g, '-')}`,
                styles: "",
                children: type.content ? JSON.parse(JSON.stringify(type.content)) : []
            };
        } else {
            newBlock = {
                id,
                tag: type.tag,
                content: type.defaultContent,
                href: type.defaultHref || "",
                className: "",
                styles: "",
                children: []
            };
        }

        const updated = [...blocks, newBlock];
        setBlocks(updated);
        sync(updated);
        if (setActiveBlock) setActiveBlock(id);
        if (setActiveTab && allowedTabs.includes("properties")) setActiveTab("properties");
    };

    const addChild = (parentId, type, isComponent = false) => {
        const id = Math.random().toString(36).substr(2, 9);
        let newBlock;

        if (isComponent) {
            newBlock = {
                id,
                tag: "div",
                content: "",
                className: `component-${type.nom?.toLowerCase().replace(/\s+/g, '-')}`,
                styles: "",
                htmlId: "",
                children: type.content ? JSON.parse(JSON.stringify(type.content)) : []
            };
        } else {
            newBlock = {
                id,
                tag: type.tag,
                content: type.defaultContent,
                href: type.defaultHref || "",
                className: "",
                styles: "",
                htmlId: "",
                children: []
            };
        }

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
        if (setActiveBlock) setActiveBlock(id);
        if (setActiveTab && allowedTabs.includes("properties")) setActiveTab("properties");
    };

    // const handleBindToBlock = (ctrlIndex, bindingIndex) => {
    //     if (!activeBlock || !onUpdateControllers) return;
    //     const newCtrls = JSON.parse(JSON.stringify(availableControllers));
    //     const ctrl = newCtrls[ctrlIndex];
    //     if (!ctrl.bindings) ctrl.bindings = [];

    //     ctrl.bindings[bindingIndex].id_element = activeBlock;

    //     onUpdateControllers(newCtrls);
    //     if (showToast) showToast(`Bound to block: ${activeBlock}`);
    // };

    const handleLinkController = (ctrlIndex) => {
        if (!onUpdateControllers) return;
        const newCtrls = JSON.parse(JSON.stringify(availableControllers));
        newCtrls[ctrlIndex].page_nom = currentPageName;
        onUpdateControllers(newCtrls);
        if (showToast) showToast(`Controller linked to ${currentPageName}`);
    };

    const handleUnlinkController = (ctrlIndex) => {
        if (!onUpdateControllers) return;
        const newCtrls = JSON.parse(JSON.stringify(availableControllers));
        newCtrls[ctrlIndex].page_nom = "";
        onUpdateControllers(newCtrls);
        if (showToast) showToast(`Controller unlinked from page`);
    };

    const getIconForTag = (tag) => {
        const type = BLOCK_TYPES.find(t => t.tag === tag);
        return type ? type.icon : <Type size={14} />;
    };

    const currentActiveBlock = findBlock(blocks, activeBlock);

    const handleStyleChange = (prop, value) => {
        if (!currentActiveBlock) return;
        let stylesObj = { desktop: {}, tablet: {}, mobile: {} };
        try {
            if (currentActiveBlock.styles && currentActiveBlock.styles.trim().startsWith('{')) {
                stylesObj = { ...stylesObj, ...JSON.parse(currentActiveBlock.styles) };
            } else {
                stylesObj.desktop = parseStyles(currentActiveBlock.styles || "");
            }
        } catch (e) {
            console.log(e)
            stylesObj.desktop = parseStyles(currentActiveBlock.styles || "");
        }

        const vp = activeViewport || "desktop";
        stylesObj[vp] = { ...(stylesObj[vp] || {}), [prop]: value };
        updateBlock(currentActiveBlock.id, { styles: JSON.stringify(stylesObj) });
    };

    const handlePageStyleChange = (prop, value) => {
        let allStyles = { desktop: {}, tablet: {}, mobile: {} };
        try {
            if (pageStyles && pageStyles.trim().startsWith('{')) {
                allStyles = { ...allStyles, ...JSON.parse(pageStyles) };
            } else {
                // Migration ancien format
                allStyles.desktop[selectedGlobalTag] = pageStyles;
            }
        } catch (e) {
            console.log(e)
            allStyles.desktop[selectedGlobalTag] = pageStyles;
        }

        const vp = activeViewport || "desktop";
        if (!allStyles[vp]) allStyles[vp] = {};

        const currentTagStyles = parseStyles(allStyles[vp][selectedGlobalTag] || "");
        const updatedTagStyles = { ...currentTagStyles, [prop]: value };
        allStyles[vp][selectedGlobalTag] = stringifyStyles(updatedTagStyles);

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
                            <AddChild block={block} addChild={addChild} />
                            <DeleteBlock block={block} removeBlock={removeBlock} />
                        </div>
                    </div>
                </div>

                {/* Affichage des contrôleurs liés comme "enfants" visuels, regroupés par endpoint */}
                {(() => {
                    const blockBindings = bindingsMap[block.id];
                    if (!blockBindings || blockBindings.length === 0) return null;

                    const groupedByEndpoint = blockBindings.reduce((acc, binding) => {
                        if (!acc[binding.endpoint_nom]) {
                            acc[binding.endpoint_nom] = {
                                endpoint_nom: binding.endpoint_nom,
                                ctrlName: binding.ctrlName, // Assuming ctrlName is consistent per endpoint for a block
                                map_fields: []
                            };
                        }
                        acc[binding.endpoint_nom].map_fields.push(binding.map_field);
                        return acc;
                    }, {});

                    return Object.values(groupedByEndpoint).map((group, groupIdx) => (
                        <div
                            key={`grouped-binding-${block.id}-${groupIdx}`}
                            style={{ marginLeft: `${(level + 1) * 16}px` }}
                            className="flex items-center gap-2 p-1.5 px-3 mb-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold group/ctrl hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40 transition-colors"
                            title={`Controller: ${group.ctrlName}, Endpoint: ${group.endpoint_nom}, Fields: ${group.map_fields.join(', ')}`}
                        >
                            <Database size={10} className="opacity-70 shrink-0" />
                            <span className="uppercase tracking-tighter truncate">{group.endpoint_nom}</span>
                            <span className="opacity-40 font-medium">({group.map_fields.join(', ')})</span>
                        </div>
                    ));
                })()}

                {block.children && block.children.length > 0 && renderBlocksList(block.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
            {allowedTabs.length > 1 && (
                <div className="flex bg-white/50 dark:bg-gray-800 p-1 rounded-xl border border-couleur1/10 shadow-sm">
                    {allowedTabs.includes("blocks") && <ChangeTabBtn icon={<Layers size={14} />} value={"Structure"} setter={setActiveTab} activeTab={activeTab} newVal={'blocks'} />}
                    {allowedTabs.includes("global") && <ChangeTabBtn icon={<Globe size={14} />} value={"Global"} setter={setActiveTab} activeTab={activeTab} newVal={"global"} />}
                    {allowedTabs.includes("data") && <ChangeTabBtn icon={<Database size={14} />} value={"Data"} setter={setActiveTab} activeTab={activeTab} newVal={"data"} />}
                    {allowedTabs.includes("properties") && <ChangeTabBtn icon={<Settings2 size={14} />} value={"Properties"} setter={setActiveTab} activeTab={activeTab} newVal={"properties"} />}
                </div>
            )}

            {activeTab === "blocks" && allowedTabs.includes("blocks") ? (
                <BlockTab blocks={blocks} renderBlocksList={renderBlocksList} addBlock={addBlock} availableComponents={availableComponents} />
            ) : activeTab === "global" && allowedTabs.includes("global") ? (
                <GlobalTab
                    availableSelectors={availableSelectors}
                    activeViewport={activeViewport}
                    setSelectedGlobalTag={setSelectedGlobalTag}
                    handlePageStyleChange={handlePageStyleChange}
                    pageStyles={pageStyles}
                    selectedGlobalTag={selectedGlobalTag}
                />
            ) : activeTab === "properties" && allowedTabs.includes("properties") ? (
                <PropertiesTab
                    availablePages={availablePages}
                    activeViewport={activeViewport}
                    currentActiveBlock={currentActiveBlock}
                    getIconForTag={getIconForTag}
                    handleStyleChange={handleStyleChange}
                    updateBlock={updateBlock}
                    onCopyStyle={() => handleCopyStyle(currentActiveBlock?.styles)}
                    onPasteStyle={() => handlePasteStyle(currentActiveBlock?.id)}
                    hasCopiedStyle={!!copiedStyle}
                />
            ) : (activeTab === "data" || activeTab === "Data") ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2">
                        <Database size={14} /> Active Controllers
                    </h3>
                    {availableControllers.map((ctrl, originalIdx) => {
                        if (ctrl.page_nom !== currentPageName) return null;
                        const uniqueEndpoints = [...new Set(ctrl.bindings?.map(b => b.endpoint_nom) || [])];
                        return (
                            <div key={originalIdx} className="bg-white/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-couleur1/10">
                                <div className="text-sm font-bold text-couleur1 mb-3">{ctrl.nom}</div>
                                <div key={originalIdx} className="bg-white/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-couleur1/10 group mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-sm font-bold text-couleur1">{ctrl.nom}</div>
                                        <button
                                            onClick={() => handleUnlinkController(originalIdx)}
                                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Unlink from page"
                                        >
                                            <Unlink size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {uniqueEndpoints.map((epName, epIdx) => (
                                            <div key={epIdx} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg text-[10px] border border-couleur1/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-couleur1/40"></div>
                                                <span className="font-bold text-couleur1 uppercase tracking-wider">{epName}</span>
                                            </div>
                                        ))}
                                        {uniqueEndpoints.length === 0 && (
                                            <p className="text-[10px] opacity-50 italic">Aucun endpoint configuré.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <h3 className="text-xs font-black uppercase text-couleur1/40 mt-8 flex items-center gap-2">
                        <PlusSquare size={14} /> Available Controllers
                    </h3>
                    <div className="space-y-2">
                        {availableControllers.map((ctrl, originalIdx) => {
                            if (ctrl.page_nom === currentPageName) return null;
                            return (
                                <button
                                    key={originalIdx}
                                    onClick={() => handleLinkController(originalIdx)}
                                    className="w-full flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/20 border border-couleur1/10 rounded-xl hover:bg-couleur1/5 hover:border-couleur1/30 transition-all group text-left"
                                >
                                    <div>
                                        <div className="text-[11px] font-bold text-couleur1">{ctrl.nom}</div>
                                        <div className="text-[9px] opacity-40">{ctrl.page_nom ? `Linked to: ${ctrl.page_nom}` : 'Not linked'}</div>
                                    </div>
                                    <Plus size={14} className="text-couleur1/40 group-hover:text-couleur1" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div >
    );
}