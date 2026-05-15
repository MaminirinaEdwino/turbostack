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
import PropertiesTab from "./components/propertieTab";


export default function VisualEditor({ 
    content, 
    pageStyles = "", 
    onPageStylesChange, 
    onChange, 
    availablePages = [],
    activeBlock,
    setActiveBlock,
    activeTab,
    setActiveTab,
    allowedTabs = ["blocks", "global", "properties"]
}) {
    const [blocks, setBlocks] = useState([]);
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
        if (setActiveBlock) setActiveBlock(id);
        if (setActiveTab && allowedTabs.includes("properties")) setActiveTab("properties");
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
        if (setActiveBlock) setActiveBlock(id);
        if (setActiveTab && allowedTabs.includes("properties")) setActiveTab("properties");
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
            {allowedTabs.length > 1 && (
                <div className="flex bg-white/50 dark:bg-gray-800 p-1 rounded-xl border border-couleur1/10 shadow-sm">
                    {allowedTabs.includes("blocks") && <ChangeTabBtn icon={<Layers size={14} /> } value={"Structure"} setter={setActiveTab} activeTab={activeTab} newVal={'blocks'}/>}
                    {allowedTabs.includes("global") && <ChangeTabBtn icon={<Globe size={14} /> } value={"Global"} setter={setActiveTab} activeTab={activeTab} newVal={"global"}/>}
                    {allowedTabs.includes("properties") && <ChangeTabBtn icon={<Settings2 size={14} /> } value={"Properties"} setter={setActiveTab} activeTab={activeTab} newVal={"properties"}/>}
                </div>
            )}

            {activeTab === "blocks" && allowedTabs.includes("blocks") ? (
                <BlockTab blocks={blocks} renderBlocksList={renderBlocksList} addBlock={addBlock}/>
            ) : activeTab === "global" && allowedTabs.includes("global") ? (
                <GlobalTab availableSelectors={availableSelectors} setSelectedGlobalTag={setSelectedGlobalTag} handlePageStyleChange={handlePageStyleChange} pageStyles={pageStyles} selectedGlobalTag={selectedGlobalTag}/>
            ) : allowedTabs.includes("properties") ? (
                <PropertiesTab availablePages={availablePages} currentActiveBlock={currentActiveBlock} getIconForTag={getIconForTag} handleStyleChange={handleStyleChange} updateBlock={updateBlock}/>
            ) : null}
        </div >
    );
}