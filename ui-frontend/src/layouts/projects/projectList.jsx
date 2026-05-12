import { Folder, FolderPlus } from "lucide-react";
import LayoutHeader from "../../components/layoutHeader";
import SideMenu from "../../components/sideMenu";
import ProjectListCard from "./projectListCard";
import ListView from "../../components/listView";
import { GoApp } from "../../services/bridge";
import { useEffect, useState } from "react";

export default function ProjectList() {
    const [ProjectList, setProjects] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GoApp.fetchProjects()// Ton URL Go

                setProjects(response);
            } catch (err) {
                console.error("Erreur Turbo Stack:", err);
            }
        }
        loadData()
    }, [])

    return <div className="flex h-screen w-full font-san bg-couleur3">

        <SideMenu></SideMenu>
        <ListView
            listIcon={<Folder size={100}></Folder>}
            newText={"New Project"}
            sectionName={"Project Lists"}
            content={ProjectList}
            elementView={ProjectListCard}
            newIcon={<FolderPlus size={50}></FolderPlus>}
        ></ListView>
    </div>
}