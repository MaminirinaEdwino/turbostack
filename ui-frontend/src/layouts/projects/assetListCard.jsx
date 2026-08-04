import { Folder } from "lucide-react";

export default function AssetListCard(name){
    return <div key={name.file_name} className=" dark:bg-gray-900 flex flex-col border justify-between  border-couleur7 max-w-50 text-center m-2 rounded-lg p-2 text-couleur1">
        <img src={name.base_64_image} alt=""  className=" max-w-50"/>
        <span>{name.file_name}</span>
    </div>
}