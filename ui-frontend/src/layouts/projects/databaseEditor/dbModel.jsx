import { Edit, Trash2 } from "lucide-react";

export default function DbModel({data}){
   const handleOnclick = ()=>{
      
   }
    return <div className="border border-couleur1 rounded-lg overflow-hidden" onClick={handleOnclick}>
         <div className="border-b border-couleur1 p-2 bg-couleur3 flex justify-between items-center">
            <span className="font-medium">{data.nom}</span>
            <div className="flex gap-2">
                <button className="cursor-pointer text-blue-500 hover:text-blue-700 p-1 rounded transition-colors" onClick={(e) => { e.stopPropagation(); data.onEdit(); }}><Edit size={16} /></button>
                <button className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded transition-colors" onClick={(e) => { e.stopPropagation(); data.onDelete(); }}><Trash2 size={16} /></button>
            </div>
         </div>
         <div>
            {data.champs.map((item, index)=><div key={index} className="p-2 border-t border-couleur1/10 last:border-b-0">{item.nom} : {item.type} {item.default_value}</div>)}
         </div>
    </div>
}