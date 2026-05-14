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
    const toggleMenu = useSelector((state) => state.app.toggleMenuSide);
    const actualWindow = useSelector((state) => state.app.actualWindow);
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Project', icon: <Folder size={18} /> },
        // { name: 'Components', icon: <LucidePuzzle size={18} /> },
        // { name: 'Assets', icon: <ImageIcon size={18} /> },
        { name: 'Models', icon: <Database size={18} /> },
        { name: 'Web App', icon: <FileText size={18} /> },
        { name: 'Static Site', icon: <FileText size={18} /> },
        { name: 'Api', icon: <Settings size={18} /> },
        { name: 'Subscription', icon: <CreditCard size={18} /> },
    ];
    
    const handleToggleMenu = (e)=>{
        e.preventDefault()
        dispatch(setToggleMenuSide())
    }
    return <aside className={`flex flex-col p-6 bg-couleur3 transition-all duration-300 ease-in-out border-r border-couleur1/10 ${toggleMenu ? "w-64" : "w-24"}`} >
        <div className="flex items-center gap-2 mb-10 overflow-hidden whitespace-nowrap" >
            <div className="w-8 h-8 rounded-full bg-red-500 shrink-0"></div>
            <span className={`text-xl font-bold text-couleur1 transition-all duration-300 ${toggleMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`} >TurboStack</span>
        </div>
        <nav className="flex-1 space-y-2 overflow-hidden">
            <button onClick={handleToggleMenu} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-opacity-10 hover:bg-couleur1 border-couleur7 hover:text-couleur3 text-couleur1 w-full justify-start">
                <div className="shrink-0">
                    {toggleMenu ? <SidebarClose size={20}></SidebarClose > : <SidebarOpen size={20}></SidebarOpen>}
                </div>
            </button>
            {menuItems.map((item) => {
                // L'onglet est actif s'il correspond exactement au nom, ou si c'est 'Project' et qu'on est dans une vue projet
                const isActive = actualWindow === item.name || 
                    (item.name === 'Project' && ['New Project', 'Project Home Page', 'db_editor'].includes(actualWindow));
                
                return (
                    <div
                        key={item.name}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all overflow-hidden whitespace-nowrap 
                            ${isActive 
                                ? "bg-couleur1 text-couleur3 border-couleur1 shadow-sm" 
                                : "border-couleur7 text-couleur1 hover:bg-opacity-10 hover:bg-couleur1 hover:text-couleur3"}`}
                        onClick={() => navigateTo(item.name)}
                    >
                        <div className="shrink-0">
                            {item.icon}
                        </div>
                        <span className={`font-medium transition-all duration-300 ${toggleMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </nav>

    </aside>

}