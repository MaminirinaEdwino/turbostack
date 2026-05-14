export const StatCard = ({ title, total, icon, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-5 p-6 rounded-xl shadow-lg text-white bg-couleur1 ${onClick ? 'cursor-pointer hover:bg-opacity-90 transition-all active:scale-95' : ''}`} >
        <div className="opacity-80">{icon}</div>
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm opacity-80 font-light">Total : {total}</p>
        </div>
    </div>
);