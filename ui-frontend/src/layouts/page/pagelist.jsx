import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import { LucideSheet, SheetIcon } from "lucide-react"

export default function Pageslist() {
    const ComponentList = [
        "Page 1",
        "Page 2",
        "Page 3",
        "Page 4",
        "Page 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            listIcon={<SheetIcon size={100}></SheetIcon> }
            newText={"New Page"}
            sectionName={"Page Lists"}
            content={ComponentList}
            elementView={ProjectListCard}
            newIcon={<LucideSheet size={50}></LucideSheet>}
        ></ListView>
    </div>
}