import React, { useState, useEffect } from "react";
import { 
    Type, Image as ImageIcon, Trash2, 
    Plus, Settings2, Edit3, 
    Layout as LayoutIcon, MousePointer2
} from "lucide-react";

export default function VisualEditor({ content, onChange }) {
    const [blocks, setBlocks] = useState([]);
    const [activeBlock, setActiveBlock] = useState(null);

    // Initialisation unique des blocs à partir du HTML reçu pour éviter les boucles infinies
    useEffect(() => {
        if (!content) return;

        let extracted = [];
        try {
            // Tente de parser comme JSON (Méthode de stockage plus fiable pour le No-Code)
            extracted = JSON.parse(content);
            if (!Array.isArray(extracted)) throw new Error();
        } catch (e) {
            // Fallback : parsing HTML si ce n'est pas encore du JSON (compatibilité données existantes)
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

        // Comparaison pour éviter de réinitialiser l'état pendant la saisie (perte de focus)
        const currentSerialized = JSON.stringify(blocks);
        const incomingSerialized = JSON.stringify(extracted);

        if (currentSerialized !== incomingSerialized) {
            setBlocks(extracted);
        }
    }, [content]);

    // Synchronisation vers le parent
    const sync = (currentBlocks) => {
        // On stocke les blocs sérialisés en string JSON
        onChange(JSON.stringify(currentBlocks)); 
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

    const addBlock = () => {
        const newBlock = {
            id: Math.random().toString(36).substr(2, 9),
            tag: "div",
            content: "Nouvelle section",
            className: "p-4",
            styles: ""
        };
        const updated = [...blocks, newBlock];
        setBlocks(updated);
        sync(updated);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-couleur1/60">
                    <MousePointer2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Éditeur Visuel</span>
                </div>
                <button onClick={addBlock} className="flex items-center gap-1.5 bg-couleur1 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase hover:scale-105 transition-all">
                    <Plus size={12} /> Add Block
                </button>
            </div>

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div 
                        key={block.id}
                        className={`group p-5 rounded-3xl border transition-all ${activeBlock === block.id ? "bg-white border-couleur1 shadow-xl" : "bg-white/50 border-transparent hover:border-couleur1/20"}`}
                        onClick={() => setActiveBlock(block.id)}
                    >
                        <div className="flex justify-between mb-3">
                            <span className="text-[10px] font-bold text-couleur1 uppercase opacity-40">{block.tag} #{index + 1}</span>
                            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <textarea 
                            className="w-full bg-transparent border-none outline-none text-sm resize-none"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}