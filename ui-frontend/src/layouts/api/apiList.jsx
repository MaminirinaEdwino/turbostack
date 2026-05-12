import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import { Settings, SettingsIcon } from "lucide-react"

export default function APIlist() {
    const ComponentList = [
        "API 1",
        "API 2",
        "API 3",
        "API 4",
        "API 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            listIcon={<Settings size={100}></Settings>}
            newText={"New API"}
            sectionName={"API Lists"}
            content={ComponentList}
            elementView={ProjectListCard}
            newIcon={<SettingsIcon size={50}></SettingsIcon>}
        ></ListView>
    </div>
}