import { Check, X, Plus, Trash2, Database } from "lucide-react";
import { useState } from "react";

export default function NewEndpoint({ project, setProject, setToggle }) {
    const [endpoint, setEndpoint] = useState({
        nom: "", uri: "/", method: "GET", role: "public", model: [], params: [],
        manual_fields: []
    });
    const [manualField, setManualField] = useState({ nom: "", type: "string" });
    const [tableName, setTableName] = useState("");

    const availableModels = project.bdd?.models || [];

    const handleSave = (e) => {
        e.preventDefault();
        const currentEndpoints = project.rest_api?.endpoints || [];
        setProject({
            ...project,
            rest_api: {
                ...project.rest_api,
                endpoints: [...currentEndpoints, endpoint]
            }
        });
        setToggle("none");
    };

    const toggleModelSelection = (model) => {
        const isSelected = endpoint.model.some(m => m.nom === model.nom);
        if (isSelected) {
            setEndpoint({ 
                ...endpoint, 
                model: endpoint.model.filter(m => m.nom !== model.nom),
                params: endpoint.params.filter(p => !model.champs.some(c => c.nom === p))
            });
        } else {
            setEndpoint({ ...endpoint, model: [...endpoint.model, { ...model }] });
        }
    };

    const addManualField = () => {
        if (!manualField.nom || endpoint.manual_fields.some(f => f.nom === manualField.nom)) return;
        setEndpoint({ ...endpoint, manual_fields: [...endpoint.manual_fields, manualField] });
        setManualField({ nom: "", type: "string" });
    };

    const removeManualField = (nom) => {
        setEndpoint(prev => ({
            ...prev,
            manual_fields: prev.manual_fields.filter(f => f.nom !== nom),
            params: prev.params.filter(p => p !== nom),
            model: prev.model.map(m => m.nom === "Manual" ? { ...m, champs: m.champs.filter(f => f.nom !== nom) } : m).filter(m => m.nom !== "Manual" || m.champs.length > 0)
        }));
    };

    const generateTableFromManual = () => {
        if (!tableName || endpoint.manual_fields.length === 0) return;
        if (availableModels.some(m => m.nom.toLowerCase() === tableName.toLowerCase())) {
            alert("Une table avec ce nom existe déjà.");
            return;
        }

        const newModel = {
            nom: tableName,
            champs: endpoint.manual_fields.map(f => ({ ...f, default_value: "" }))
        };

        setProject({ ...project, bdd: { ...project.bdd, models: [...availableModels, newModel] } });
        setTableName("");
    };

    const toggleUriParam = (fieldName) => {
        const isSelected = endpoint.params.includes(fieldName);
        if (isSelected) {
            setEndpoint({ ...endpoint, params: endpoint.params.filter(p => p !== fieldName) });
        } else {
            setEndpoint({ ...endpoint, params: [...endpoint.params, fieldName] });
        }
    };

    const toggleManualBodyField = (field) => {
        setEndpoint(prev => {
            const hasManual = prev.model.some(m => m.nom === "Manual");
            let newModels;

            if (!hasManual) {
                newModels = [...prev.model, { nom: "Manual", champs: [field] }];
            } else {
                newModels = prev.model.map(m => {
                    if (m.nom !== "Manual") return m;
                    const hasField = m.champs.some(f => f.nom === field.nom);
                    return { ...m, champs: hasField ? m.champs.filter(f => f.nom !== field.nom) : [...m.champs, field] };
                }).filter(m => m.nom !== "Manual" || m.champs.length > 0);
            }
            return { ...prev, model: newModels };
        });
    };

    const toggleBodyField = (modelName, field) => {
        const updatedModels = endpoint.model.map(m => {
            if (m.nom === modelName) {
                const hasField = m.champs.some(f => f.nom === field.nom);
                if (hasField) {
                    return { ...m, champs: m.champs.filter(f => f.nom !== field.nom) };
                } else {
                    return { ...m, champs: [...m.champs, field] };
                }
            }
            return m;
        });
        setEndpoint({ ...endpoint, model: updatedModels });
    };

    return (
        <form className="bg-white border border-couleur1 p-6 rounded-xl shadow-2xl flex flex-col w-[550px] max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-2xl text-couleur1 mb-4">New Endpoint</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold opacity-50 uppercase">Name</label>
                    <input className="border border-couleur1 p-2 rounded-lg outline-none focus:ring-2 ring-couleur1/20" type="text" value={endpoint.nom} onChange={(e) => setEndpoint({ ...endpoint, nom: e.target.value })} placeholder="Get Users" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold opacity-50 uppercase">Method</label>
                    <select className="border border-couleur1 p-2 rounded-lg bg-white" value={endpoint.method} onChange={(e) => setEndpoint({ ...endpoint, method: e.target.value })}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <label className="text-xs font-bold opacity-50 uppercase">URI Path</label>
                <input className="border border-couleur1 p-2 rounded-lg font-mono text-sm" type="text" value={endpoint.uri} onChange={(e) => setEndpoint({ ...endpoint, uri: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1 mb-6">
                <label className="text-xs font-bold opacity-50 uppercase">Associated Models</label>
                <div className="flex flex-wrap gap-2 mt-2 border border-dashed border-couleur1/30 p-3 rounded-lg min-h-[60px]">
                    {availableModels.map((m, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => toggleModelSelection(m)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                                endpoint.model.some(sel => sel.nom === m.nom)
                                ? "bg-couleur1 text-white border-couleur1"
                                : "bg-white text-couleur1 border-couleur1/30 hover:bg-couleur3"
                            }`}
                        >
                            {m.nom}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1 mb-6">
                <label className="text-xs font-bold opacity-50 uppercase">Manual Fields</label>
                <div className="flex gap-2 mt-2">
                    <input className="flex-1 border border-couleur1 p-2 rounded-lg text-sm" type="text" placeholder="Field name" value={manualField.nom} onChange={(e) => setManualField({ ...manualField, nom: e.target.value })} />
                    <select className="border border-couleur1 p-2 rounded-lg text-sm bg-white" value={manualField.type} onChange={(e) => setManualField({ ...manualField, type: e.target.value })}>
                        <option value="string">String</option>
                        <option value="int">Integer</option>
                        <option value="boolean">Boolean</option>
                    </select>
                    <button type="button" onClick={addManualField} className="bg-couleur1 text-white p-2 rounded-lg"><Plus size={18}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {endpoint.manual_fields.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-couleur3 px-3 py-1 rounded-full border border-couleur1/20 text-xs">
                            <span className="font-medium">{f.nom}</span>
                            <span className="opacity-50">({f.type})</span>
                            <button type="button" onClick={() => removeManualField(f.nom)} className="text-red-500 hover:text-red-700">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                {endpoint.manual_fields.length > 0 && (
                    <div className="mt-4 p-3 bg-couleur1/5 border border-dashed border-couleur1/30 rounded-lg">
                        <label className="text-[10px] font-bold text-couleur1 uppercase mb-2 block">Générer une table BDD</label>
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 border border-couleur1 p-2 rounded-lg text-sm bg-white" 
                                type="text" 
                                placeholder="Nom de la table (ex: Profil)" 
                                value={tableName} 
                                onChange={(e) => setTableName(e.target.value)} 
                            />
                            <button type="button" onClick={generateTableFromManual} className="bg-couleur1 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2 hover:bg-opacity-90 transition-all">
                                <Database size={14}/> Créer Table
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(endpoint.model.length > 0 || endpoint.manual_fields.length > 0) && (
                <div className="flex flex-col gap-3 mb-6 border-t border-couleur1/10 pt-4">
                    <label className="text-xs font-bold opacity-50 uppercase">Fields Configuration (URI vs Body)</label>
                    
                    {/* Config pour les champs manuels */}
                    {endpoint.manual_fields.length > 0 && (
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200 shadow-inner mb-2">
                            <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Manual Fields
                            </h4>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-left opacity-60">
                                        <th className="pb-2">Field Name</th>
                                        <th className="pb-2 text-center">URI Param</th>
                                        <th className="pb-2 text-center">Body Request</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {endpoint.manual_fields.map((f) => (
                                        <tr key={f.nom} className="border-t border-blue-100">
                                            <td className="py-2 text-blue-800 font-medium">{f.nom} <span className="text-[10px] opacity-40">[{f.type}]</span></td>
                                            <td className="py-2 text-center">
                                                <input type="checkbox" checked={endpoint.params.includes(f.nom)} onChange={() => toggleUriParam(f.nom)} className="accent-blue-600 cursor-pointer w-4 h-4" />
                                            </td>
                                            <td className="py-2 text-center">
                                                <input type="checkbox" checked={endpoint.model.find(m => m.nom === "Manual")?.champs.some(bc => bc.nom === f.nom)} onChange={() => toggleManualBodyField(f)} className="accent-blue-600 cursor-pointer w-4 h-4" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {endpoint.model.map((m) => {
                        if (m.nom === "Manual") return null;
                        const originalModel = availableModels.find(om => om.nom === m.nom);
                        return (
                            <div key={m.nom} className="bg-couleur3/30 p-4 rounded-lg border border-couleur1/10 shadow-inner">
                                <h4 className="text-sm font-bold text-couleur1 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-couleur1"></div>
                                    {m.nom}
                                </h4>
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-left opacity-60">
                                            <th className="pb-2">Field Name</th>
                                            <th className="pb-2 text-center">URI Param</th>
                                            <th className="pb-2 text-center">Body Request</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {originalModel?.champs.map((f) => (
                                            <tr key={f.nom} className="border-t border-couleur1/5 hover:bg-white/40 transition-colors">
                                                <td className="py-2 text-couleur1 font-medium">{f.nom} <span className="text-[10px] opacity-40">[{f.type}]</span></td>
                                                <td className="py-2 text-center">
                                                    <input type="checkbox" checked={endpoint.params.includes(f.nom)} onChange={() => toggleUriParam(f.nom)} className="accent-couleur1 cursor-pointer w-4 h-4" />
                                                </td>
                                                <td className="py-2 text-center">
                                                    <input type="checkbox" checked={m.champs.some(bc => bc.nom === f.nom)} onChange={() => toggleBodyField(m.nom, f)} className="accent-couleur1 cursor-pointer w-4 h-4" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setToggle("none")} className="px-5 py-2 rounded-lg border border-couleur1 text-couleur1 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-couleur1 text-white font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                    <Check size={18}/> Create Endpoint
                </button>
            </div>
        </form>
    );
}