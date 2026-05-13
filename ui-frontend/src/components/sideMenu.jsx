import {
    LayoutDashboard, CreditCard,
    Image as ImageIcon, Database, FileText, LogOut, Settings,
    Folder,
    LucidePuzzle,
    SidebarClose,
    SidebarOpen
} from "lucide-react";
import { useNavigate } from "../hooks/useNavigate";
import { useDispatch, useSelector } from "react-redux";
import { setToggleMenuSide } from "../appSlice";
export default function SideMenu() {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const toggleMenu = useSelector((state)=>state.app.toggleMenuSide)
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Project', icon: <Folder size={18} /> },
        { name: 'Components', icon: <LucidePuzzle size={18} /> },
        { name: 'Assets', icon: <ImageIcon size={18} /> },
        { name: 'Models', icon: <Database size={18} /> },
        { name: 'Pages', icon: <FileText size={18} /> },
        { name: 'Api', icon: <Settings size={18} /> },
        { name: 'Subscription', icon: <CreditCard size={18} /> },
    ];
    
    const handleToggleMenu = (e)=>{
        e.preventDefault()
        dispatch(setToggleMenuSide())
    }
    return <aside className={"flex flex-col p-6 bg-couleur3 transition-all transition-delay-500 "+(toggleMenu? "w-64": "w-fit")} >
        <div className="flex items-center gap-2 mb-10" >
            <div className="w-8 h-8 rounded-full bg-red-500"></div>
            {toggleMenu && <span className="text-xl font-bold text-couleur1" >TurboStack</span>}
        </div>
        <nav className="flex-1 space-y-2">
            <button onClick={handleToggleMenu} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-opacity-10 hover:bg-couleur1 border-couleur7 hover:text-couleur3 text-couleur1">
                {toggleMenu ? <SidebarClose size={20}></SidebarClose > : <SidebarOpen size={20}></SidebarOpen>}
                
            </button>
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-opacity-10 hover:bg-couleur1 border-couleur7 hover:text-couleur3 text-couleur1 "
                    onClick={() => navigateTo(item.name)}
                >
                    {item.icon}
                    {toggleMenu  && <span className="font-medium">{item.name}</span>}
                </div>
            ))}
        </nav>

    </aside>

}