import SideMenu from "../components/sideMenu";

export default function MainLayout({child}){
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        {child}
    </div>
}