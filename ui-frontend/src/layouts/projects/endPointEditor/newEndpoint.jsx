import { Check, X, Plus } from "lucide-react";
import { useState } from "react";

export default function NewEndpoint({ project, setProject, setToggle }) {
    const [endpoint, setEndpoint] = useState({
        nom: "", uri: "/", method: "GET", role: "public", model: [], params: []
    });

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
            setEndpoint({ ...endpoint, model: endpoint.model.filter(m => m.nom !== model.nom) });
        } else {
            setEndpoint({ ...endpoint, model: [...endpoint.model, model] });
        }
    };

    return (
        <form className="bg-white border border-couleur1 p-6 rounded-xl shadow-2xl flex flex-col w-[450px]">
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

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setToggle("none")} className="px-5 py-2 rounded-lg border border-couleur1 text-couleur1 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-couleur1 text-white font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                    <Check size={18}/> Create Endpoint
                </button>
            </div>
        </form>
    );
}