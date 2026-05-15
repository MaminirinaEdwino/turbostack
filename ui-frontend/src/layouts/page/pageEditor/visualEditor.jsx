import React, { useState, useEffect } from "react";
import {
    Type, Image as ImageIcon, Trash2,
    Plus, Edit3, Settings2,
    MousePointer2, Heading1, Heading2, Pilcrow, Box, Square,
    ChevronDown, Layers, GripVertical, Link
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

export default function VisualEditor({ content, onChange, availablePages = [] }) {
    const [blocks, setBlocks] = useState([]);
    const [activeBlock, setActiveBlock] = useState(null);
    const [activeTab, setActiveTab] = useState("blocks"); // "blocks" or "props"
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [showAddMenu, setShowAddMenu] = useState(false);

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
        setShowAddMenu(false);
        setActiveBlock(id);
        setActiveTab("props");
    };

    const getIconForTag = (tag) => {
        const type = BLOCK_TYPES.find(t => t.tag === tag);
        return type ? type.icon : <Type size={14} />;
    };

    const currentActiveBlock = blocks.find(b => b.id === activeBlock);

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
                    onClick={() => setActiveTab("props")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'props' ? 'bg-couleur1 text-white shadow-md' : 'text-couleur1/60 hover:text-couleur1'}`}
                >
                    <Settings2 size={14} /> Properties
                </button>
            </div>

            {activeTab === "blocks" ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="flex items-center gap-2 bg-couleur1 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase hover:shadow-lg transition-all"
                            >
                                <Plus size={12} /> New Section <ChevronDown size={12} />
                            </button>

                            {showAddMenu && (
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-couleur1/10 shadow-2xl rounded-2xl p-2 z-50 grid grid-cols-1 gap-1 animate-in zoom-in-95 duration-200">
                                    {BLOCK_TYPES.map((type) => (
                                        <button
                                            key={type.tag}
                                            onClick={() => addBlock(type)}
                                            className="flex items-center gap-3 w-full p-2.5 hover:bg-couleur3 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-couleur1 dark:text-gray-300 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-couleur1/10 flex items-center justify-center text-couleur1">
                                                {type.icon}
                                            </div>
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
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
            )}
        </div>
    );
}