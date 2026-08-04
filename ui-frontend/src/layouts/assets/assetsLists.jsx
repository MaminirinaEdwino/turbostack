import { ImageIcon, ImagePlusIcon } from "lucide-react"
import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { GoApp } from "../../services/bridge"
import AssetListCard from "../projects/assetListCard"

export default function Assetslist() {
    const projectName = useSelector((state) => state.app.actualProject)
    const [assets, setAssets] = useState([])
    const loadProject = async () => {
        const res = await GoApp.fetchProjectByName(projectName)
        console.log(res)
        if (res.type == "static" || res.type == "web_app") {
            if (res.assets != null) {
                setAssets(res.assets)
            }
        }
    }
    useEffect(() => {
        const loadProject = async () => {
            const res = await GoApp.fetchProjectByName(projectName)
            console.log(res)
            if (res.type == "static" || res.type == "web_app") {
                if (res.assets != null) {
                    setAssets(res.assets)
                }
            }
        }
        loadProject()
    }, [projectName])
    return <div className="flex h-screen w-full dark:bg-gray-950">
        <SideMenu></SideMenu>
        <ListView
            listIcon={<ImageIcon size={100}></ImageIcon>}
            newText={"Upload asset"}
            sectionName={"Assets Lists"}
            content={assets}
            elementView={AssetListCard}
            newIcon={<ImagePlusIcon size={50}></ImagePlusIcon>}
            reloadAsset={loadProject}
        ></ListView>
    </div>
}