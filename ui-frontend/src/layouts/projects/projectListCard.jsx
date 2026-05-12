import { Folder } from "lucide-react";

export default function ProjectListCard(name, icon, navigator){
    // const navigate = useNavigate()
    return <div key={name} className="flex flex-col border  border-couleur7 w-fit text-center m-2 rounded-lg p-2 text-couleur1" onClick={()=>{
        navigator(name)
    }}>
        {icon}
        <span>{name}</span>
    </div>
}