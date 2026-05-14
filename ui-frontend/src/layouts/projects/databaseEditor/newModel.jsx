import { Check, Delete, Edit, Plus } from "lucide-react";
import { useState } from "react";

export default function NewModel({ modelList, setModelList, setToggle }) {
    const [modelName, setModelName] = useState('')
    const [addField, setAddfield] = useState(false)
    const [fields, setFields] = useState([])
    const [newField, setNewField] = useState({
        nom: "",
        type: "",
        default_value: ""
    })
    const handleNewField = () => {
        setFields(fields => [...fields, newField])
        setAddfield(false)
    }
    const handleNewModel = (e) => {
        e.preventDefault()
        console.log(modelList)
        if (modelList.models == null) {
            setModelList({
                sgbd: "",
                models: [{ nom: modelName, champs: fields }]
            })
        } else {
            setModelList({ ...modelList, models: [...modelList.models, { nom: modelName, champs: fields }] })
        }

    }
    const handleCancel = (e) => {
        e.preventDefault()
        setModelName('')
        setAddfield(false)
        setFields([])
        setNewField({
            nom: "",
            type: "",
            default_value: ""
        })
        setToggle("none")
    }
    return (<form className="bg-couleur5 border border-couleur1 m-2 p-4 rounded-lg flex flex-col">
        <h3 className="font-semibold text-2xl text-couleur1">New Table</h3>
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
                        {fields.map((item) => <>
                            <tr className="p-1">
                                <td>{item.nom}</td>
                                <td>{item.type}</td>
                                <td>{item.default_value}</td>
                                <td className="flex gap-2">
                                    <button className="p-1 bg-amber-300 text-white rounded"><Edit></Edit></button>
                                    <button className="p-1 bg-red-500 text-white rounded"><Delete></Delete></button>
                                </td>
                            </tr>
                        </>)}
                        {addField && <tr className="p-1">
                            <td>
                                <input type="text" placeholder="Field Name" onInput={(e) => setNewField({ ...newField, nom: e.target.value })} value={newField.nom} className="m-2 p-2 border-b border-couleur1 outline-0 "/>
                            </td>
                            <td>
                                <select className="bg-couleur3 m-2 p-2 border-b border-couleur1 outline-0 " name="type" id="fieldType" onInput={(e) => { setNewField({ ...newField, type: e.target.value }) }}>
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
                <button onClick={handleNewModel} className="px-6 py-2 bg-couleur1 rounded text-couleur3">Save</button>
                <button className="px-6 py-2 bg-couleur3 rounded text-couleur1 border border-couleur1" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    </form>)

}