import { MousePointer2, Copy, ClipboardPaste } from "lucide-react";
import { BLOCK_TYPES, STYLE_CONTROLS, TAG_STYLE_GROUPS } from "../defaultVar";
import { parseStyles } from "../utilsFunc";

export default function PropertiesTab({
    currentActiveBlock, getIconForTag, updateBlock, handleStyleChange, availablePages,
    activeViewport = "desktop", onCopyStyle, onPasteStyle, hasCopiedStyle
}) {
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
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>
                                <div className="flex gap-2">
                                    <button onClick={onCopyStyle} className="p-1 text-couleur1/40 hover:text-couleur1 transition-all" title="Copier le style">
                                        <Copy size={14} />
                                    </button>
                                    <button onClick={onPasteStyle} disabled={!hasCopiedStyle} className={`p-1 transition-all ${hasCopiedStyle ? 'text-couleur1/40 hover:text-couleur1' : 'opacity-10 cursor-not-allowed'}`} title="Coller le style">
                                        <ClipboardPaste size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                                {STYLE_CONTROLS.filter(ctrl => (TAG_STYLE_GROUPS[currentActiveBlock.tag] || []).includes(ctrl.prop)).map((ctrl) => {
                                    let currentValue = currentStyles[ctrl.prop] || "";

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
    </>
}