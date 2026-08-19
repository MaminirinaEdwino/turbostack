import { Database, ImageIcon, Layout, Navigation, Settings, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { GoApp } from "../services/bridge";
import { useSelector } from "react-redux";
import { useNavigate } from "../hooks/useNavigate";

export default function WorkspaceNavigationBar() {
    const projectName = useSelector(state => state.app.actualProject)
    const navigate = useNavigate()
    const [projectType, setProjectType] = useState("")
    useEffect(() => {
        const loadData = async () => {
            const res = await GoApp.getProjectType(projectName)
            setProjectType(res)
        }
        loadData()
    }, [projectName])
    return <div className="fixed bg-couleur1 opacity-40 hover:opacity-100 dark:bg-gray-900/90 backdrop-blur-md p-1.5 px-3 gap-4 bottom-3 left-1/2 -translate-x-1/2 z-40 rounded-full border border-couleur1/10 dark:border-white/10 shadow-xl flex items-center w-11  hover:w-60 transition-all duration-500 ease-in-out group overflow-hidden">
        <h3 className="text-sm font-semibold dark:text-gray-200 flex items-center gap-4 text-couleur3 whitespace-nowrap min-w-max">
            <Navigation size={18} />
        </h3>
        <div className="flex items-center w-full justify-around gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <button
                className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                title="Go to DashBoard"
                onClick={() => navigate("Dashboard")}
            >
                <Layout size={18}></Layout>
            </button>
            {
                ["static", "webapp"].includes(projectType) && <button
                    className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Go to assets list"
                    onClick={() => navigate("Assets")}
                >
                    <ImageIcon size={18}></ImageIcon>
                </button>
            }
            {
                ["webapp", "api", "bdd"].includes(projectType) && <button
                    className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Go to Db editor"
                    onClick={() => navigate("db_editor")}
                >
                    <Database size={18}></Database>
                </button>
            }
            {
                ["webapp", "api"].includes(projectType) && <button
                    className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Go to API editor"
                    onClick={() => navigate("api_editor")}
                >
                    <Settings size={18}></Settings>
                </button>
            }
            {
                ["webapp", "static"].includes(projectType) && <button
                    className="p-1.5 rounded-lg text-couleur3 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Go to page editor"
                    onClick={() => navigate("page_editor")}
                >
                    <LayoutDashboard size={18}></LayoutDashboard>
                </button>
            }

        </div>
    </div>
}