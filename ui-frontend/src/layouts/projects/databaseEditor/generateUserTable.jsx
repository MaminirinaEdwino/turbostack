import { Check, X, User } from "lucide-react";
import { useState } from "react";

export default function GenerateUserTable({ setModelList, modelList, setToggle }) {
    const [roles, setRoles] = useState("admin, user");

    const handleGenerate = (e) => {
        e.preventDefault();
        const userModel = {
            nom: "User",
            champs: [
                { nom: "id", type: "int", default_value: "" },
                { nom: "username", type: "string", default_value: "" },
                { nom: "password", type: "string", default_value: "" },
                { nom: "email", type: "string", default_value: "" },
                { nom: "role", type: "string", default_value: roles }
            ]
        };

        if (modelList && modelList.models && modelList.models.some(m => m.nom === "User")) {
            alert("A table named 'User' already exists.");
            return;
        }

        const updatedModels = modelList && modelList.models ? [...modelList.models, userModel] : [userModel];
        setModelList({ ...modelList, models: updatedModels });
        setToggle("none");
    };

    return (
        <form className="bg-white border border-couleur1 p-6 rounded-xl shadow-2xl flex flex-col w-[400px]">
            <div className="flex items-center gap-2 mb-4 text-couleur1">
                <User />
                <h3 className="font-bold text-2xl text-couleur1">Quick User Table</h3>
            </div>
            
            <div className="flex flex-col gap-1 mb-6">
                <label className="text-xs font-bold opacity-50 uppercase">Default Roles (comma separated)</label>
                <input className="border border-couleur1 p-2 rounded-lg outline-none focus:ring-2 ring-couleur1/20" type="text" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="admin, user, editor" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setToggle("none")} className="px-5 py-2 rounded-lg border border-couleur1 text-couleur1 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleGenerate} className="px-5 py-2 rounded-lg bg-couleur1 text-white font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                    <Check size={18}/> Generate User Table
                </button>
            </div>
        </form>
    );
}