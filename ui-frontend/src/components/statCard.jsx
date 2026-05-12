export const StatCard = ({ title, total, icon }) => (
    <div className="flex items-center gap-5 p-6 rounded-xl shadow-lg text-white bg-couleur1" >
        <div className="opacity-80">{icon}</div>
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm opacity-80 font-light">Total : {total}</p>
        </div>
    </div>
);