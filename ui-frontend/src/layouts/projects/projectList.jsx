import { FolderPlus } from "lucide-react";
import LayoutHeader from "../../components/layoutHeader";
import SideMenu from "../../components/sideMenu";
import ProjectListCard from "./projectListCard";
import ListView from "../../components/listView";

export default function ProjectList() {
    const ProjectList = [
        "Project 1",
        "Project 2",
        "Project 3",
        "Project 4",
        "Project 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            newText={"New Project"}
            sectionName={"Project Lists"}
            content={ProjectList}
            elementView={ProjectListCard}
            newIcon={<FolderPlus size={50}></FolderPlus>}
        ></ListView>
    </div>
}