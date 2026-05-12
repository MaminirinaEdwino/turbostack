import { ImageIcon } from "lucide-react"
import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"

export default function Assetslist(){
    const ComponentList = [
        "Asset 1",
        "Asset 2",
        "Asset 3",
        "Asset 4",
        "Asset 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            newText={"Upload asset"}
            sectionName={"Assets Lists"}
            content={ComponentList}
            elementView={ProjectListCard}
            newIcon={<ImageIcon size={50}></ImageIcon>}
        ></ListView>
    </div> 
}