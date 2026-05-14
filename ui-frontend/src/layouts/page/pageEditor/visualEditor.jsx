import React, { useState, useEffect } from "react";
import { 
    Type, Image as ImageIcon, Trash2, 
    Plus, Edit3, 
    MousePointer2, Heading1, Heading2, Pilcrow, Box, Square, 
    ChevronDown, Layers
} from "lucide-react";

const BLOCK_TYPES = [
    { label: "Section", tag: "div", icon: <Box size={14} />, defaultContent: "Conteneur vide" },
    { label: "Titre 1", tag: "h1", icon: <Heading1 size={14} />, defaultContent: "Titre principal" },
    { label: "Titre 2", tag: "h2", icon: <Heading2 size={14} />, defaultContent: "Sous-titre" },
    { label: "Paragraphe", tag: "p", icon: <Pilcrow size={14} />, defaultContent: "Votre texte ici..." },
    { label: "Image", tag: "img", icon: <ImageIcon size={14} />, defaultContent: "https://via.placeholder.com/800x400" },
    { label: "Bouton", tag: "button", icon: <Square size={14} />, defaultContent: "Cliquez ici" },
];

export default function VisualEditor({ content, onChange }) {
    const [blocks, setBlocks] = useState([]);
    const [activeBlock, setActiveBlock] = useState(null);
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
                className: el.className,
                styles: el.getAttribute("style") || ""
            }));
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

    const updateBlock = (id, fields) => {
        const updated = blocks.map(b => b.id === id ? { ...b, ...fields } : b);
        setBlocks(updated);
        sync(updated);
    };

    const removeBlock = (id) => {
        const updated = blocks.filter(b => b.id !== id);
        setBlocks(updated);
        sync(updated);
    };

    const addBlock = (type) => {
        const newBlock = {
            id: Math.random().toString(36).substr(2, 9),
            tag: type.tag,
            content: type.defaultContent,
            className: type.tag === "div" ? "p-8 border border-dashed border-gray-200 rounded-xl" : "",
            styles: ""
        };
        const updated = [...blocks, newBlock];
        setBlocks(updated);
        sync(updated);
        setShowAddMenu(false);
    };

    const getIconForTag = (tag) => {
        const type = BLOCK_TYPES.find(t => t.tag === tag);
        return type ? type.icon : <Type size={14} />;
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"> {/* Removed max-w-4xl mx-auto */}
            <div className="flex items-center justify-between px-2">
                
                <div className="relative">
                    <button 
                        onClick={() => setShowAddMenu(!showAddMenu)} 
                        className="flex items-center gap-2 bg-couleur1 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase hover:shadow-lg transition-all"
                    >
                        <Plus size={12} /> Add Block <ChevronDown size={12} />
                    </button>
                    
                    {showAddMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-couleur1/10 shadow-2xl rounded-2xl p-2 z-50 grid grid-cols-1 gap-1 animate-in zoom-in-95 duration-200">
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

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div 
                        key={block.id}
                        className={`group p-4 rounded-2xl border transition-all ${activeBlock === block.id ? "bg-white dark:bg-gray-900 border-couleur1 shadow-xl ring-4 ring-couleur1/5" : "bg-white/50 dark:bg-gray-900/40 border-transparent hover:border-couleur1/20"}`}
                        onClick={() => setActiveBlock(block.id)}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-couleur1/10 rounded-lg text-couleur1">
                                    {getIconForTag(block.tag)}
                                </div>
                                <span className="text-[10px] font-black text-couleur1 uppercase opacity-40 tracking-tighter">
                                    {block.tag} <span className="ml-1 opacity-20">#{index + 1}</span>
                                </span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        {activeBlock === block.id ? (
                            <textarea
                                className="w-full bg-transparent border-none outline-none text-sm resize-none dark:text-gray-200 font-sans leading-relaxed"
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                rows={2}
                                placeholder="Entrez le contenu de ce bloc..."
                            />
                        ) : (
                            <div className="text-sm dark:text-gray-400 font-sans leading-relaxed overflow-hidden">
                                {block.tag === 'img' ? (
                                    <img src={block.content} alt="Image preview" className="max-w-full h-auto max-h-20 object-contain" />
                                ) : (
                                    activeBlock === block.id && <p className="line-clamp-2">{block.content || "Contenu vide"}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}