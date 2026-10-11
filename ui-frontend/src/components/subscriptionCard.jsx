export default function SubscriptionCard({ name, illustration, text, price, setTogglekeyModal }) {
    return (
        <div className="border border-couleur1/30 bg-white p-6 rounded-2xl w-80 flex flex-col items-center m-3 shadow-lg hover:shadow-xl transition-all duration-300 relative box-border group">
            {/* Badge du nom modernisé avec un léger effet d'ombre */}
            <span className="bg-couleur1 text-couleur3 font-semibold text-sm w-fit py-1.5 px-6 rounded-full -top-4 relative shadow-md tracking-wide">
                {name}
            </span>

            {/* Illustration avec un conteneur propre */}
            <div className="my-4 p-3 bg-gray-50 rounded-xl w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img src={illustration} alt={name} className="h-32 object-contain" />
            </div>

            {/* Texte de description */}
            <p className="p-2 text-center text-gray-600 text-sm leading-relaxed mb-6">
                {text}
            </p>

            {/* Bouton d'action modernisé */}
            <button 
                onClick={() => setTogglekeyModal(true)} 
                className="w-full bg-couleur6 text-couleur3 font-medium py-2.5 px-6 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
                {price}
            </button>
        </div>
    );
}