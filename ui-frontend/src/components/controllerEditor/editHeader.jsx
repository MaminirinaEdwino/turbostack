export default function EditHeader({activeController, updateController, selectedIndex, setEditMode}) {
    return <div className="p-6 border-b border-couleur1/10 bg-couleur1/5 flex justify-between items-center">
        <input
            value={activeController?.nom || ""}
            onChange={(e) => updateController(selectedIndex, 'nom', e.target.value)}
            className="bg-transparent text-xl font-bold text-couleur1 outline-none border-b border-transparent focus:border-couleur1"
        />
        <button onClick={() => setEditMode(false)} className="text-couleur1/50 hover:text-couleur1 uppercase text-xs font-black">Close</button>
    </div>
}