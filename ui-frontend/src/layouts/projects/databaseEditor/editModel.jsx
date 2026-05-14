import { Check, Delete, Edit, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditModel({ modelList, setModelList, setToggle, index }) {
    const [modelName, setModelName] = useState('')
    const [addField, setAddfield] = useState(false)
    const [fields, setFields] = useState([])
    const [newField, setNewField] = useState({
        nom: "",
        type: "",
        default_value: ""
    })

    // Initialisation des données du modèle à modifier
    useEffect(() => {
        const setter = (model) => {
            setModelName(model.nom);
            setFields(model.champs || []);
        }
        if (modelList && modelList.models && modelList.models[index]) {
            const model = modelList.models[index];
            setter(model)
        }
    }, [index, modelList]);

    const handleNewField = (e) => {
        e.preventDefault()
        setFields(fields => [...fields, newField])
        setAddfield(false)
        setNewField({
            nom: "",
            type: "",
            default_value: ""
        })
    }

    const handleUpdateModel = (e) => {
        e.preventDefault()
        const updatedModels = [...modelList.models]
        updatedModels[index] = { nom: modelName, champs: fields }

        setModelList({
            ...modelList,
            models: updatedModels
        })
        setToggle("none")
    }

    const handleCancel = (e) => {
        e.preventDefault()
        setToggle("none")
    }

    return (<form className="bg-couleur5 border border-couleur1 m-2 p-4 rounded-lg flex flex-col">
        <h3 className="font-semibold text-2xl text-couleur1">Edit Table</h3>
        <div className=" p-2 ">
            <label className="text-couleur1" htmlFor="modelName">Model Name</label>
            <input className="border border-couleur1 m-2 px-2 py-1 rounded-lg" type="text" id="modelName" onInput={(e) => setModelName(e.target.value)} value={modelName} />
        </div>
        <div>
            <div className="flex justify-between items-center p-2">
                <h4 className="font-semibold">Model Fields</h4>
                <button className="border-couleur1 text-couleur1 flex gap-1 items-center border px-4 py-1 rounded" onClick={(e) => {
                    e.preventDefault()
                    setAddfield(true)
                }}> <Plus></Plus> Add Field</button>
            </div>
            <div className="w-full p-2 text-left">
                <table className="w-full rounded p-2 m-1 box-border">
                    <thead className="">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, idx) => (
                            <tr key={idx} className="p-1">
                                <td>{item.nom}</td>
                                <td>{item.type}</td>
                                <td>{item.default_value}</td>
                                <td className="flex gap-2">
                                    <button className="p-1 bg-amber-300 text-white rounded" onClick={(e) => e.preventDefault()}><Edit></Edit></button>
                                    <button className="p-1 bg-red-500 text-white rounded" onClick={(e) => { e.preventDefault(); setFields(fields.filter((_, i) => i !== idx)) }}><Delete></Delete></button>
                                </td>
                            </tr>
                        ))}
                        {addField && <tr className="p-1">
                            <td>
                                <input type="text" placeholder="Field Name" onInput={(e) => setNewField({ ...newField, nom: e.target.value })} value={newField.nom} className="m-2 p-2 border-b border-couleur1 outline-0 " />
                            </td>
                            <td>
                                <select className="bg-couleur3 m-2 p-2 border-b border-couleur1 outline-0 " name="type" id="fieldType" onInput={(e) => { setNewField({ ...newField, type: e.target.value }) }} value={newField.type}>
                                    <option value="">Choose a type</option>
                                    <option value="int">INT</option>
                                    <option value="string">VARCHAR</option>
                                </select>
                            </td>
                            <td><input className="m-2 p-2 border-b border-couleur1 outline-0 " type="text" placeholder="Default value" onInput={(e) => setNewField({ ...newField, default_value: e.target.value })} value={newField.default_value} /></td>
                            <td>
                                <button onClick={handleNewField} className="bg-couleur1 text-white font-semibold p-2 rounded"><Check></Check></button>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={handleUpdateModel} className="px-6 py-2 bg-couleur1 rounded text-couleur3">Update</button>
                <button className="px-6 py-2 bg-couleur3 rounded text-couleur1 border border-couleur1" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    </form>)
}