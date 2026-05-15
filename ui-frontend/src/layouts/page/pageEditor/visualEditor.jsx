import React, { useState, useEffect, useMemo } from "react";
import {
    Type, Image as ImageIcon, Trash2, Settings2, Copy, ClipboardPaste,
    MousePointer2, Layers, GripVertical, Globe, PlusSquare, Puzzle, Database, Link2, Plus, Unlink
} from "lucide-react";
import { STYLE_CONTROLS, BLOCK_TYPES, TAG_STYLE_GROUPS } from "./defaultVar";
import { parseStyles, stringifyStyles } from './utilsFunc'; // Importation groupée
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

    // Initialisation et Synchronisation
    useEffect(() => {
        if (!content) return;
        let extracted = [];
        if (Array.isArray(content)) {
            extracted = content;
        } else {
            try {
                extracted = JSON.parse(content);
            } catch (e) {
                // Fallback parsing HTML
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
            }
        }

        if (JSON.stringify(blocks) !== JSON.stringify(extracted)) {
            setBlocks(extracted);
        }
    }, [content]);

    const sync = (currentBlocks) => {
        if (onChange) onChange(currentBlocks);
    };

    // Sélecteurs pour l'onglet Global
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
        return { tags: [...tags], classes: [...classes], ids: [...ids] };
    }, [blocks]);

    // Actions sur les blocs
    const updateBlock = (id, fields) => {
        const updateTree = (list) => list.map(b => {
            if (b.id === id) return { ...b, ...fields };
            if (b.children) return { ...b, children: updateTree(b.children) };
            return b;
        });
        const updated = updateTree(blocks);
        setBlocks(updated);
        sync(updated);
    };

    const removeBlock = (id) => {
        const removeFromTree = (list) => list.filter(b => b.id !== id).map(b => ({
            ...b, children: b.children ? removeFromTree(b.children) : []
        }));
        const updated = removeFromTree(blocks);
        setBlocks(updated);
        sync(updated);
        if (activeBlock === id) setActiveBlock?.(null);
    };

    const addChild = (parentId, type, isComponent = false) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newBlock = isComponent ? {
            id, tag: "div", content: "", className: `comp-${type.nom?.toLowerCase()}`, styles: "", children: type.content || []
        } : {
            id, tag: type.tag, content: type.defaultContent, href: type.defaultHref || "", className: "", styles: "", children: []
        };

        const updateTree = (list) => list.map(b => {
            if (b.id === parentId) return { ...b, children: [...(b.children || []), newBlock] };
            if (b.children) return { ...b, children: updateTree(b.children) };
            return b;
        });
        const updated = updateTree(blocks);
        setBlocks(updated);
        sync(updated);
        setActiveBlock?.(id);
    };

    // Gestion du Style
    const handleStyleChange = (prop, value) => {
        const currentBlock = blocks.find(b => b.id === activeBlock) || findBlock(blocks, activeBlock);
        if (!currentBlock) return;

        let stylesObj = { desktop: {}, tablet: {}, mobile: {} };
        try {
            if (currentBlock.styles?.startsWith('{')) stylesObj = JSON.parse(currentBlock.styles);
            else stylesObj.desktop = parseStyles(currentBlock.styles || "");
        } catch (e) { stylesObj.desktop = parseStyles(currentBlock.styles || ""); }

        const vp = activeViewport || "desktop";
        stylesObj[vp] = { ...(stylesObj[vp] || {}), [prop]: value };
        updateBlock(currentBlock.id, { styles: JSON.stringify(stylesObj) });
    };

    // Helpers
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

    const getIconForTag = (tag) => BLOCK_TYPES.find(t => t.tag === tag)?.icon || <Type size={14} />;

    // Rendu récursif de la liste des blocs (Sidebar Structure)
    const renderBlocksList = (blocksList, level = 0) => {
        return blocksList.map((block, index) => (
            <React.Fragment key={block.id}>
                <div
                    draggable
                    onDragStart={(e) => { setDraggedId(block.id); e.dataTransfer.setData("sourceId", block.id); }}
                    className={`group p-3 rounded-2xl border transition-all cursor-pointer mb-2 ${activeBlock === block.id ? "bg-white border-couleur1 shadow-md" : "bg-white/50 border-transparent hover:border-couleur1/20"}`}
                    style={{ marginLeft: `${level * 12}px` }}
                    onClick={() => { setActiveBlock?.(block.id); setActiveTab?.("properties"); }}
                >
                    <div className="flex justify-between items-center">
                        <Block index={index} getIconForTag={getIconForTag} block={block} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AddChild block={block} addChild={addChild}/>
                            <DeleteBlock block={block} removeBlock={removeBlock}/>
                        </div>
                    </div>
                </div>
                {block.children && renderBlocksList(block.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden"> 
            <div className="flex bg-white/50 dark:bg-gray-800 p-1 rounded-xl border border-couleur1/10">
                {allowedTabs.includes("blocks") && <ChangeTabBtn icon={<Layers size={14} />} value="Structure" setter={setActiveTab} activeTab={activeTab} newVal="blocks"/>}
                {allowedTabs.includes("global") && <ChangeTabBtn icon={<Globe size={14} />} value="Global" setter={setActiveTab} activeTab={activeTab} newVal="global"/>}
                {allowedTabs.includes("data") && <ChangeTabBtn icon={<Database size={14} />} value="Data" setter={setActiveTab} activeTab={activeTab} newVal="data"/>}
                {allowedTabs.includes("properties") && <ChangeTabBtn icon={<Settings2 size={14} />} value="Properties" setter={setActiveTab} activeTab={activeTab} newVal="properties"/>}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {activeTab === "blocks" && (
                    <BlockTab blocks={blocks} renderBlocksList={renderBlocksList} addBlock={(t) => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const newB = { id, tag: t.tag, content: t.defaultContent, styles: "", children: [] };
                        setBlocks([...blocks, newB]); sync([...blocks, newB]); setActiveBlock?.(id);
                    }} availableComponents={availableComponents}/>
                )}

                {(activeTab === "data" || activeTab === "Data") && (
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase text-couleur1/40 flex items-center gap-2 tracking-widest">
                            <Database size={12} /> Controllers on this page
                        </h3>
                        {availableControllers.map((ctrl, originalIdx) => {
                            if (ctrl.page_nom !== currentPageName) return null;
                            const uniqueEndpoints = [...new Set(ctrl.bindings?.map(b => b.endpoint_nom) || [])];
                            return (
                                <div key={originalIdx} className="bg-white/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-couleur1/10 group">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-sm font-bold text-couleur1">{ctrl.nom}</div>
                                        <button onClick={() => {
                                            const newCtrls = [...availableControllers];
                                            newCtrls[originalIdx].page_nom = "";
                                            onUpdateControllers(newCtrls);
                                        }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                            <Unlink size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueEndpoints.map(ep => (
                                            <span key={ep} className="px-2 py-1 bg-couleur1/5 text-couleur1 text-[9px] font-bold rounded-md border border-couleur1/10">{ep}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <h3 className="text-[10px] font-black uppercase text-couleur1/40 mt-8 flex items-center gap-2 tracking-widest">
                            <PlusSquare size={12} /> Other Controllers
                        </h3>
                        <div className="space-y-2">
                            {availableControllers.filter(c => c.page_nom !== currentPageName).map((ctrl, originalIdx) => (
                                <button key={originalIdx} onClick={() => {
                                    const newCtrls = [...availableControllers];
                                    newCtrls[originalIdx].page_nom = currentPageName;
                                    onUpdateControllers(newCtrls);
                                }} className="w-full flex items-center justify-between p-3 bg-white/20 border border-couleur1/10 rounded-xl hover:bg-couleur1/5 group transition-all">
                                    <span className="text-xs font-bold text-couleur1/70">{ctrl.nom}</span>
                                    <Plus size={14} className="text-couleur1/40 group-hover:text-couleur1" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "properties" && (
                    <PropertiesTab 
                        currentActiveBlock={findBlock(blocks, activeBlock)} 
                        handleStyleChange={handleStyleChange}
                        availablePages={availablePages}
                        activeViewport={activeViewport}
                        getIconForTag={getIconForTag}
                        updateBlock={updateBlock}
                    />
                )}
            </div>
        </div>
    );
}