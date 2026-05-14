import { Check, X, Layers } from "lucide-react";
import { useState } from "react";

export default function GenerateCrud({ project, setProject, setToggle }) {
    const [selectedModel, setSelectedModel] = useState(null);
    const [bodyFields, setBodyFields] = useState([]);

    const availableModels = project.bdd?.models || [];

    const handleModelChange = (modelName) => {
        const model = availableModels.find(m => m.nom === modelName);
        setSelectedModel(model);
        if (model) {
            // Par défaut, on inclut tout sauf l'ID dans le body
            setBodyFields(model.champs.map(c => c.nom).filter(name => name.toLowerCase() !== 'id'));
        }
    };

    const toggleBodyField = (fieldName) => {
        setBodyFields(prev => 
            prev.includes(fieldName) 
                ? prev.filter(f => f !== fieldName) 
                : [...prev, fieldName]
        );
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!selectedModel) return;

        const baseUri = `/${selectedModel.nom.toLowerCase()}`;
        const selectedChamps = selectedModel.champs.filter(c => bodyFields.includes(c.nom));
        
        const newEndpoints = [
            {
                nom: `List ${selectedModel.nom}`,
                uri: baseUri, method: "GET", role: "public",
                model: [], params: [], manual_fields: []
            },
            {
                nom: `Get ${selectedModel.nom} by ID`,
                uri: `${baseUri}/:id`, method: "GET", role: "public",
                model: [], params: ["id"], manual_fields: [{ nom: "id", type: "int" }]
            },
            {
                nom: `Create ${selectedModel.nom}`,
                uri: baseUri, method: "POST", role: "public",
                model: [{ ...selectedModel, champs: selectedChamps }],
                params: [], manual_fields: []
            },
            {
                nom: `Update ${selectedModel.nom}`,
                uri: `${baseUri}/:id`, method: "PUT", role: "public",
                model: [{ ...selectedModel, champs: selectedChamps }],
                params: ["id"], manual_fields: [{ nom: "id", type: "int" }]
            },
            {
                nom: `Delete ${selectedModel.nom}`,
                uri: `${baseUri}/:id`, method: "DELETE", role: "public",
                model: [], params: ["id"], manual_fields: [{ nom: "id", type: "int" }]
            }
        ];

        const currentEndpoints = project.rest_api?.endpoints || [];
        setProject({
            ...project,
            rest_api: {
                ...project.rest_api,
                endpoints: [...currentEndpoints, ...newEndpoints]
            }
        });
        setToggle("none");
    };

    return (
        <form className="bg-white border border-couleur1 p-6 rounded-xl shadow-2xl flex flex-col w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
                <Layers className="text-couleur1" />
                <h3 className="font-bold text-2xl text-couleur1">Auto-Generate CRUD</h3>
            </div>

            <div className="flex flex-col gap-1 mb-6">
                <label className="text-xs font-bold opacity-50 uppercase">Select Table</label>
                <select className="border border-couleur1 p-2 rounded-lg bg-white mt-1" onChange={(e) => handleModelChange(e.target.value)} value={selectedModel?.nom || ""}>
                    <option value="">-- Choose a table --</option>
                    {availableModels.map((m, i) => <option key={i} value={m.nom}>{m.nom}</option>)}
                </select>
            </div>

            {selectedModel && (
                <div className="flex flex-col gap-3 mb-6 border-t border-couleur1/10 pt-4">
                    <label className="text-xs font-bold opacity-50 uppercase">POST/PUT Body Fields</label>
                    <div className="bg-couleur3/30 p-4 rounded-lg border border-couleur1/10 shadow-inner">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-left opacity-60">
                                    <th className="pb-2">Field Name</th>
                                    <th className="pb-2 text-center">In Body</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedModel.champs.map((f) => (
                                    <tr key={f.nom} className="border-t border-couleur1/5">
                                        <td className="py-2 text-couleur1 font-medium">{f.nom}</td>
                                        <td className="py-2 text-center">
                                            <input type="checkbox" checked={bodyFields.includes(f.nom)} onChange={() => toggleBodyField(f.nom)} className="accent-couleur1 cursor-pointer w-4 h-4" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setToggle("none")} className="px-5 py-2 rounded-lg border border-couleur1 text-couleur1">Cancel</button>
                <button onClick={handleGenerate} disabled={!selectedModel} className={`px-5 py-2 rounded-lg bg-couleur1 text-white font-semibold flex items-center gap-2 ${!selectedModel ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}>
                    <Check size={18}/> Generate 5 Endpoints
                </button>
            </div>
        </form>
    );
}