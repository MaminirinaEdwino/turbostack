import React, { useState, useEffect, useMemo } from "react";
import {
    Type, Image as ImageIcon, Trash2,
    Plus, Edit3, Settings2,
    MousePointer2, Heading1, Heading2, Pilcrow, Box, Square,
    ChevronDown, Layers, GripVertical, Link, Globe
} from "lucide-react";

const BLOCK_TYPES = [
    { label: "Section", tag: "div", icon: <Box size={14} />, defaultContent: "Conteneur vide" },
    { label: "Titre 1", tag: "h1", icon: <Heading1 size={14} />, defaultContent: "Titre principal" },
    { label: "Titre 2", tag: "h2", icon: <Heading2 size={14} />, defaultContent: "Sous-titre" },
    { label: "Paragraphe", tag: "p", icon: <Pilcrow size={14} />, defaultContent: "Votre texte ici..." },
    { label: "Lien", tag: "a", icon: <Link size={14} />, defaultContent: "Cliquez ici", defaultHref: "/" },
    { label: "Image", tag: "img", icon: <ImageIcon size={14} />, defaultContent: "https://via.placeholder.com/800x400" },
    { label: "Bouton", tag: "button", icon: <Square size={14} />, defaultContent: "Cliquez ici" },
];

const parseStyles = (styleString) => {
    if (!styleString) return {};
    return styleString.split(';').reduce((acc, rule) => {
        const parts = rule.split(':');
        if (parts.length < 2) return acc;
        const prop = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        if (prop && value) acc[prop] = value;
        return acc;
    }, {});
};

const stringifyStyles = (styleObj) => {
    return Object.entries(styleObj)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, v]) => v && v !== "")
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
};

const STYLE_CONTROLS = [
    { label: "Texte", prop: "color", type: "color" },
    { label: "Taille", prop: "font-size", type: "number", placeholder: "e.g. 16" },
    { label: "Align", prop: "text-align", type: "select", options: ["left", "center", "right", "justify"] },
    { label: "Gras", prop: "font-weight", type: "select", options: ["normal", "bold", "100", "300", "500", "700", "900"] },
    { label: "Fond", prop: "background-color", type: "color" },
    { label: "Padding", prop: "padding", type: "number", placeholder: "e.g. 10" },
    { label: "Marge", prop: "margin", type: "number", placeholder: "e.g. 0" },
    { label: "Arrondi", prop: "border-radius", type: "number", placeholder: "e.g. 8" },
    { label: "Largeur", prop: "width", type: "number", placeholder: "100" },
    { label: "Hauteur", prop: "height", type: "number", placeholder: "auto" },
    { label: "Display", prop: "display", type: "select", options: ["block", "inline-block", "flex", "grid", "none"] },
    { label: "Flex dir", prop: "flex-direction", type: "select", options: ["flex-col", "flex-row"] },
];

const TAG_STYLE_GROUPS = {
    h1: ["color", "font-size", "text-align", "font-weight", "margin"],
    h2: ["color", "font-size", "text-align", "font-weight", "margin"],
    p: ["color", "font-size", "text-align", "margin"],
    a: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius"],
    button: ["color", "font-size", "font-weight", "background-color", "padding", "border-radius", "margin"],
    div: ["background-color", "padding", "margin", "border-radius", "width", "height", "display", "flex-direction"],
    img: ["width", "height", "border-radius", "margin", "display"],
    page: ["color", "font-size", "background-color", "padding", "margin"]
};

export default function VisualEditor({ content, pageStyles = "", onPageStylesChange, onChange, availablePages = [] }) {
    const [blocks, setBlocks] = useState([]);
    const [activeBlock, setActiveBlock] = useState(null);
    const [activeTab, setActiveTab] = useState("blocks"); // "blocks" or "props"
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [selectedGlobalTag, setSelectedGlobalTag] = useState("body");

    const usedTags = useMemo(() => {
        const tags = new Set(["body"]);
        blocks.forEach(b => { if (TAG_STYLE_GROUPS[b.tag]) tags.add(b.tag); });
        return Array.from(tags);
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
                extracted = Array.from(doc.body.children).map((el) => ({
                    id: el.getAttribute("data-block-id") || Math.random().toString(36).substr(2, 9),
                    tag: el.tagName.toLowerCase(),
                    content: el.innerHTML,
                    href: el.getAttribute("href") || "",
                    className: el.className,
                    styles: el.getAttribute("style") || ""
                }));
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
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        // Stocker l'index dans le dataTransfer pour une récupération fiable au drop
        e.dataTransfer.setData("sourceIndex", index.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));

        if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

        const updatedBlocks = [...blocks];
        const [movedBlock] = updatedBlocks.splice(sourceIndex, 1);
        updatedBlocks.splice(targetIndex, 0, movedBlock);

        setBlocks(updatedBlocks);
        sync(updatedBlocks);
        setDraggedIndex(null);
    };

    const updateBlock = (id, fields) => {
        const updated = blocks.map(b => b.id === id ? { ...b, ...fields } : b);
        setBlocks(updated);
        sync(updated);
    };

    // const removeBlock = (id) => {
    //     const updated = blocks.filter(b => b.id !== id);
    //     setBlocks(updated);
    //     sync(updated);
    // };

    const removeBlock = (id) => {
        const updated = blocks.filter(b => b.id !== id);
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
            styles: ""
        };
        const updated = [...blocks, newBlock];
        setBlocks(updated);
        sync(updated);
        setActiveBlock(id);
        setActiveTab("props");
    };

    const getIconForTag = (tag) => {
        const type = BLOCK_TYPES.find(t => t.tag === tag);
        return type ? type.icon : <Type size={14} />;
    };

    const currentActiveBlock = blocks.find(b => b.id === activeBlock);

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

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"> {/* Removed max-w-4xl mx-auto */}
            {/* Tabs Header */}
            <div className="flex bg-white/50 dark:bg-gray-800 p-1 rounded-xl border border-couleur1/10 shadow-sm">
                <button
                    onClick={() => setActiveTab("blocks")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'blocks' ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
                >
                    <Layers size={14} /> Structure
                </button>
                <button
                    onClick={() => setActiveTab("global")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'global' ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
                >
                    <Globe size={14} /> Global
                </button>
                <button
                    onClick={() => setActiveTab("props")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'props' ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
                >
                    <Settings2 size={14} /> Properties
                </button>
            </div>

            {activeTab === "blocks" ? (
                <div className="space-y-6">
                    <div className="flex flex-col gap-3 px-2">
                        <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Bibliothèque d'éléments</label>
                        <div className="grid grid-cols-2 gap-2">
                            {BLOCK_TYPES.map((type) => (
                                <button
                                    key={type.tag}
                                    onClick={() => addBlock(type)}
                                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-gray-900 border border-couleur1/10 rounded-2xl hover:border-couleur1 hover:shadow-sm transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-couleur1/10 flex items-center justify-center text-couleur1 group-hover:bg-couleur1 group-hover:text-white transition-colors">
                                        {type.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-couleur1 dark:text-gray-300 text-center">
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-couleur1/10">
                        <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider px-2">Structure actuelle</label>
                        {blocks.map((block, index) => (
                            <div
                                key={block.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={() => setDraggedIndex(null)}
                                className={`group p-3 rounded-2xl border transition-all cursor-pointer ${draggedIndex === index ? "opacity-20 border-dashed border-couleur1 scale-95" : ""
                                    } ${activeBlock === block.id ? "bg-white dark:bg-gray-900 border-couleur1 shadow-md ring-4 ring-couleur1/5" : "bg-white/50 dark:bg-gray-900/40 border-transparent hover:border-couleur1/20"}`}
                                onClick={() => selectBlock(block.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="cursor-grab active:cursor-grabbing text-couleur1/20 group-hover:text-couleur1/60 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <GripVertical size={14} />
                                        </div>
                                        <div className="p-1.5 bg-couleur1/10 rounded-lg text-couleur1">
                                            {getIconForTag(block.tag)}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-couleur1 dark:text-gray-400 uppercase tracking-tighter">
                                                {block.tag}
                                            </span>
                                            <p className="text-[11px] opacity-40 font-mono">#{index + 1}</p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === "global" ? (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 p-4 bg-couleur1/5 rounded-2xl border border-couleur1/10">
                        <div className="p-3 bg-couleur1 text-white rounded-xl shadow-sm">
                            <Globe size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-couleur1 opacity-40">Page Settings</p>
                            <p className="text-sm font-bold text-couleur1 dark:text-gray-200">Global Page Style</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Élément cible</label>
                        <select
                            className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-couleur1/10 outline-none text-sm font-semibold text-couleur1 dark:text-white appearance-none cursor-pointer focus:ring-2 ring-couleur1/20 transition-all"
                            value={selectedGlobalTag}
                            onChange={(e) => setSelectedGlobalTag(e.target.value)}
                        >
                            {usedTags.map(tag => (
                                <option key={tag} value={tag}>{tag === 'body' ? 'Toute la page (Body)' : `Tous les <${tag.toUpperCase()}>`}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>
                        <div className="grid grid-cols-2 gap-3 bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                            {STYLE_CONTROLS.filter(ctrl => (TAG_STYLE_GROUPS[selectedGlobalTag === "body" ? "page" : selectedGlobalTag] || []).includes(ctrl.prop)).map((ctrl) => {
                                let stylesObj = {};
                                try {
                                    stylesObj = JSON.parse(pageStyles || "{}");
                                } catch (e) {
                                    console.log(e)
                                    stylesObj = { body: pageStyles };
                                }
                                
                                const styles = parseStyles(stylesObj[selectedGlobalTag] || "");
                                let currentValue = styles[ctrl.prop] || "";

                                return (
                                    <div key={ctrl.prop} className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label}</span>
                                        {ctrl.type === "number" ? (
                                            <div className="flex gap-1">
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
                                                        handlePageStyleChange(ctrl.prop, numValue === "" ? "" : `${numValue}${unit}`);
                                                    }}
                                                />
                                                <select
                                                    className="bg-white dark:bg-gray-900 px-2 py-1.5 rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all"
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
                                                onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                            >
                                                <option value="">--</option>
                                                {ctrl.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={ctrl.type}
                                                className={`w-full bg-white dark:bg-gray-900 ${ctrl.type === 'color' ? 'h-8 p-1' : 'px-2 py-1.5'} rounded-lg border border-couleur1/10 text-xs outline-none focus:ring-2 ring-couleur1/20 transition-all`}
                                                placeholder={ctrl.placeholder}
                                                value={currentValue}
                                                onChange={(e) => handlePageStyleChange(ctrl.prop, e.target.value)}
                                            />)
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200/50">
                        <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-tight">
                            <strong>Astuce:</strong> Les styles appliqués ici impacteront tous les éléments de type <strong>{selectedGlobalTag.toUpperCase()}</strong> de la page.
                        </p>
                    </div>
                </div>
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