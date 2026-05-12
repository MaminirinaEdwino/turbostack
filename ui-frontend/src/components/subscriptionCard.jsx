export default function SubscriptionCard({name, illustration, text, price}) {
    return <div className="border border-couleur1 p-4 rounded-lg w-80 flex flex-col items-center m-2 box-border">
        <p className="bg-couleur1 text-couleur3 w-fit py-2 px-8 rounded-2xl -top-3 relative">{name}</p>
        <div><img src={illustration} alt="" /></div>
        <p className="p-2 text-center">{text}</p>
        <button className="bg-couleur6 text-couleur3 py-2 px-6 rounded cursor-pointer">Switch To {price}</button>
    </div>
}