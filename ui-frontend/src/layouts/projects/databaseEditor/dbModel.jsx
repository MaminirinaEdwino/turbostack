export default function DbModel({data}){
    return <div className="border border-couleur1 rounded-lg">
         <div className="border-b border-couleur1 p-2">
            {data.nom}
         </div>
         <div>
            {data.champs.map((item)=><div className="p-2">{item.nom} {item.type} {item.default_value}</div>)}
         </div>
    </div>
}