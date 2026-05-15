import { Globe } from "lucide-react";
import { STYLE_CONTROLS, TAG_STYLE_GROUPS } from "../defaultVar";
import { parseStyles } from "../utilsFunc";

export default function GlobalTab({
    selectedGlobalTag, setSelectedGlobalTag, availableSelectors, pageStyles, handlePageStyleChange, activeViewport = "desktop"
}) {
    return <>
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
                    <optgroup label="Balises">
                        {availableSelectors.tags.map(tag => (
                            <option key={tag} value={tag}>{tag === 'body' ? 'Toute la page (Body)' : `<${tag.toUpperCase()}>`}</option>
                        ))}
                    </optgroup>
                    {availableSelectors.classes.length > 0 && (
                        <optgroup label="Classes CSS">
                            {availableSelectors.classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </optgroup>
                    )}
                    {availableSelectors.ids.length > 0 && (
                        <optgroup label="IDs HTML">
                            {availableSelectors.ids.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-couleur1 opacity-50 uppercase tracking-wider">Visual Styling</label>
                <div className="grid grid-cols-2 gap-3 bg-couleur3/10 dark:bg-gray-800/50 p-4 rounded-2xl border border-couleur1/5">
                    {STYLE_CONTROLS.filter(ctrl => {
                        const isCustomSelector = selectedGlobalTag.startsWith('.') || selectedGlobalTag.startsWith('#');
                        const groupKey = isCustomSelector ? "generic" : (selectedGlobalTag === "body" ? "page" : selectedGlobalTag);
                        return (TAG_STYLE_GROUPS[groupKey] || []).includes(ctrl.prop);
                    }).map((ctrl) => {
                        let stylesObj = {};
                        try {
                            stylesObj = JSON.parse(pageStyles || "{}");
                        } catch (e) {
                            stylesObj = { body: pageStyles };
                        }

                        // Récupération selon le viewport actif dans le JSON global
                        const vpStyles = stylesObj[activeViewport] || (activeViewport === 'desktop' ? stylesObj : {});
                        const styles = parseStyles(vpStyles[selectedGlobalTag] || "");
                        
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
                    <strong>Astuce:</strong> Les styles appliqués ici impacteront tous les éléments correspondant au sélecteur <strong>{selectedGlobalTag}</strong>.
                </p>
            </div>
        </div>
    </>
}