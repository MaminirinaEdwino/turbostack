import { Folder } from "lucide-react";

export default function ProjectListCard(name){
    return <div className="flex flex-col border  border-couleur7 w-fit text-center m-2 rounded-lg p-2 text-couleur1">
        <Folder size={100}></Folder>
        <span>{name}</span>
    </div>
}