import { DatabaseIcon } from "lucide-react";
import { useNavigate } from "../../../hooks/useNavigate";

export default function BDDProjectInterface({project}){
    const navigateTo = useNavigate()
    return <div className="p-2 mt-5">
    
    <button onClick={()=>navigateTo("db_editor")} className="items-center text-couleur1 w-fit flex flex-col shadow-lg shadow-couleur6/20 p-1 rounded-lg hover:shadow-couleur6/50 transition-all transition-delay-200 border border-couleur1">
        <DatabaseIcon size={100}></DatabaseIcon>
        Table Model : {project.bdd.models ==null ? 0:project.bdd.models.length}
    </button>
    
    </div>
}