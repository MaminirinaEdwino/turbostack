import { PuzzleIcon } from "lucide-react"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import ListView from "../../components/listView"

export default function ComponentsList() {
    const ComponentList = [
        "Component 1",
        "Component 2",
        "Component 3",
        "Component 4",
        "Component 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
        listIcon={<PuzzleIcon size={100}></PuzzleIcon>}
            newText={"New Component"}
            sectionName={"Component Lists"}
            content={ComponentList}
            elementView={ProjectListCard}
            newIcon={<PuzzleIcon size={50}></PuzzleIcon>}
        ></ListView>
    </div> 
}