import { Folder, FolderPlus } from "lucide-react";
import SideMenu from "../../components/sideMenu";
import ProjectListCard from "./projectListCard";
import ListView from "../../components/listView";
import { GoApp } from "../../services/bridge";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActualProject, setActualWindow } from "../../appSlice";

export default function ProjectList() {
    const [ProjectList, setProjects] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GoApp.fetchProjects()// Ton URL Go
                console.log(response)
                if (response != null) {
                    setProjects(response)
                } 
            } catch (err) {
                console.error("Erreur Turbo Stack:", err);
            }
        }
        loadData()
    }, [])

    const handleProjectSelection = (projectName) => {
        dispatch(setActualProject(projectName));
        dispatch(setActualWindow('Dashboard'));
    };

    return <div className="flex h-screen w-full font-san bg-couleur3">

        <SideMenu></SideMenu>
        <ListView
            listIcon={<Folder size={100}></Folder>}
            newText={"New Project"}
            sectionName={"Project Lists"}
            content={ProjectList}
            elementView={(name, icon) => ProjectListCard(name, icon, handleProjectSelection)}
            newIcon={<FolderPlus size={50}></FolderPlus>}
        ></ListView>
    </div>
}