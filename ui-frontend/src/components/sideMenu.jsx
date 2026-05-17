import {
    LayoutDashboard, CreditCard,
    Image as ImageIcon, Database, FileText, LogOut, Settings,
    Folder,
    LucidePuzzle,
    SidebarClose,
    SidebarOpen,
    ChevronDown,
    ChevronRight,
    Moon,
    Sun,
    Layout,
    Globe,
    Cpu,
    SendHorizonal,
    SendToBack
} from "lucide-react";
import { useNavigate } from "../hooks/useNavigate";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setToggleDarkMode, setToggleMenuSide } from "../appSlice";
import logo from "../assets/logotransparent.png";
export default function SideMenu() {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const toggleMenu = useSelector((state) => state.app.toggleMenuSide);
    const actualWindow = useSelector((state) => state.app.actualWindow);
    const actualProject = useSelector((state) => state.app.actualProject);
    const isDarkMode = useSelector((state) => state.app.darkMode);
    const [editorExpanded, setEditorExpanded] = useState(false);

    let menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Project', icon: <Folder size={18} /> },
        // { name: 'Components', icon: <LucidePuzzle size={18} /> },
        // { name: 'Assets', icon: <ImageIcon size={18} /> },
        
        { name: 'Subscription', icon: <CreditCard size={18} /> },
    ];
    let projectMenu = [
        { name: 'Models', icon: <Database size={18} /> },
        { name: 'Web App', icon: <Layout size={18} /> },
        { name: 'Static Site', icon: <Globe size={18} /> },
        { name: 'Api', icon: <Settings size={18} /> },
        { name: 'Files', icon: <Folder size={18} /> },
        { name: 'Export', icon: <SendToBack size={18} /> },
    ]
    // Ajout des liens directs vers les éditeurs si un projet est actif
    if (actualProject) {
        menuItems.splice(2, 0, {
            name: 'Editor',
            icon: <LucidePuzzle size={18} />,
            isDropdown: true,
            subItems: [
                { name: 'db_editor', icon: <Database size={18} />, label: 'DB Editor' },
                { name: 'api_editor', icon: <Settings size={18} />, label: 'API Editor' },
                { name: 'page_editor', icon: <LayoutDashboard size={18} />, label: 'Page Editor' },
                { name: 'controller_editor', icon: <Cpu size={18} />, label: 'Controller Editor' }
            ]
        }
        );
        menuItems.push(...projectMenu)
    }
    
    const handleToggleMenu = (e)=>{
        e.preventDefault()
        dispatch(setToggleMenuSide())
    }
    return <aside className={`flex flex-col p-6 bg-couleur3 dark:bg-gray-900 transition-all duration-300 ease-in-out border-r border-couleur1/10 dark:border-white/10 ${toggleMenu ? "w-64" : "w-24"} `} >
        <div className="flex items-center gap-2 mb-10 overflow-hidden whitespace-nowrap" >
            <div className="w-8 h-8  shrink-0"> <img src={logo} alt="TurboStack" /> </div>
            <span className={`text-xl font-bold text-couleur1 transition-all duration-300 ${toggleMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`} >TurboStack</span>
        </div>
        <nav className="sidemenu flex-1 space-y-2 overflow-y-scroll">
            <button onClick={handleToggleMenu} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-opacity-10 hover:bg-couleur1 border-couleur7 hover:text-couleur3 text-couleur1 w-full justify-start">
                <div className="shrink-0">
                    {toggleMenu ? <SidebarClose size={20}></SidebarClose > : <SidebarOpen size={20}></SidebarOpen>}
                </div>
            </button>

            {/* Theme Toggle */}
            <button onClick={() => dispatch(setToggleDarkMode())} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all border-couleur7 text-couleur1 hover:bg-couleur1 hover:text-white justify-start fixed w-fit bottom-0 right-1">
                <div className="shrink-0">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </div>
            </button>

            {menuItems.map((item) => {
                const isSubActive = item.subItems?.some(sub => actualWindow === sub.name);
                // L'onglet est actif s'il correspond exactement au nom, ou si c'est 'Project' et qu'on est dans une vue de création/accueil projet
                const isActive = actualWindow === item.name || isSubActive ||
                    (item.name === 'Project' && ['New Project', 'Project Home Page'].includes(actualWindow));
                
                if (item.isDropdown) {
                    return (
                        <div key={item.name} className="flex flex-col gap-1"
                            onMouseEnter={() => !toggleMenu && setEditorExpanded(true)}
                            onMouseLeave={() => !toggleMenu && setEditorExpanded(false)}
                        >
                            <div
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all overflow-hidden whitespace-nowrap 
                                    ${isActive 
                                        ? "bg-couleur1 text-couleur3 border-couleur1 shadow-sm" 
                                        : "border-couleur7 text-couleur1 hover:bg-opacity-10 hover:bg-couleur1 hover:text-couleur3"}`}
                                onClick={() => toggleMenu ? setEditorExpanded(!editorExpanded) : null}
                            >
                                <div className="shrink-0">
                                    {item.icon}
                                </div>
                                <div className={`flex-1 flex items-center justify-between transition-all duration-300 ${toggleMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                                    <span className="font-medium">
                                        {item.label || item.name}
                                    </span>
                                    {editorExpanded || isSubActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </div>
                            </div>
                            
                            {/* Sous-menu quand la barre est ouverte */}
                            {toggleMenu && (editorExpanded || isSubActive) && (
                                <div className="flex flex-col gap-1 ml-6 pl-4 border-l-2 border-couleur1/10 transition-all">
                                    {item.subItems.map(sub => (
                                        <div 
                                            key={sub.name}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm transition-all
                                                ${actualWindow === sub.name ? "bg-couleur1 text-couleur3" : "text-couleur1/70 hover:bg-couleur1/5 hover:text-couleur1"}`}
                                            onClick={() => navigateTo(sub.name)}
                                        >
                                            {sub.icon}
                                            <span>{sub.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Mini menu flottant quand la barre est fermée (repliée) */}
                            {!toggleMenu && editorExpanded && (
                                <div className="fixed left-24 bg-white border border-couleur1/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                                    {item.subItems.map(sub => (
                                        <div 
                                            key={sub.name}
                                            className={`flex items-center gap-3 p-2 px-4 rounded-lg cursor-pointer text-sm whitespace-nowrap transition-all
                                                ${actualWindow === sub.name ? "bg-couleur1 text-white" : "text-couleur1 hover:bg-couleur3"}`}
                                            onClick={() => navigateTo(sub.name)}
                                        >
                                            {sub.icon}
                                            <span>{sub.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

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
                            {item.label || item.name}
                        </span>
                    </div>
                );
            })}
        </nav>

    </aside>

}