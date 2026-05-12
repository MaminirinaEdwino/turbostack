import {
    LayoutDashboard, CreditCard,
    Image as ImageIcon, Database, FileText, LogOut, Settings,
    Folder,
    LucidePuzzle
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setActualWindow } from "../appSlice";
export default function SideMenu() {
    const dispatch = useDispatch();

    // Fonction pour changer la fenêtre actuelle
    const navigateTo = (windowName) => {
        dispatch(setActualWindow(windowName));
    };
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Project', icon: <Folder size={18} /> },
        { name: 'Components', icon: <LucidePuzzle size={18} /> },
        { name: 'Assets', icon: <ImageIcon size={18} /> },
        { name: 'Models', icon: <Database size={18} /> },
        { name: 'Pages', icon: <FileText size={18} /> },
        { name: 'Subscription', icon: <CreditCard size={18} /> },
    ];

    return <aside className="w-64 flex flex-col p-6 bg-couleur3" >
        <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-red-500"></div>
            <span className="text-xl font-bold text-couleur1" >TurboStack</span>
        </div>
        <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-opacity-10 hover:bg-couleur1 border-couleur7 hover:text-couleur3 text-couleur1"
                    onClick={()=>navigateTo(item.name)}
                >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                </div>
            ))}
        </nav>

    </aside>

}