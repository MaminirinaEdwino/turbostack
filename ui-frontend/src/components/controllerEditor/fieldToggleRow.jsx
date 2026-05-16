export default function FieldToggleRow({ fieldNom, isActive, onToggle }) {
    return (
        <div className={`flex items-center justify-between p-2.5 px-4 rounded-xl border transition-all ${isActive ? 'bg-white shadow-sm border-couleur1/20' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}>
            {/* Checkbox et Nom du champ */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="w-3.5 h-3.5 accent-couleur1 cursor-pointer"
                />
                <span className={`text-xs font-bold ${isActive ? 'text-couleur1' : 'text-couleur1/60'}`}>{fieldNom}</span>
            </div>
        </div>
    );
}