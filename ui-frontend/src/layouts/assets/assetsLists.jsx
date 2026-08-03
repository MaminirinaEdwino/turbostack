import { ImageIcon, ImagePlusIcon } from "lucide-react"
import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { GoApp } from "../../services/bridge"

export default function Assetslist() {
    const projectName = useSelector((state) => state.app.actualProject)
    const [assets, setAssets] = useState([])
    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            console.log(res)
            if (res.type == "static" || res.type == "web_app") {
                if (res.site_statique.assets != null) {
                    setAssets(res.site_static.assets)
                }
            }
        }
        loadProject()
    }, [projectName])
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            listIcon={<ImageIcon size={100}></ImageIcon>}
            newText={"Upload asset"}
            sectionName={"Assets Lists"}
            content={assets}
            elementView={ProjectListCard}
            newIcon={<ImagePlusIcon size={50}></ImagePlusIcon>}
        ></ListView>
    </div>
}