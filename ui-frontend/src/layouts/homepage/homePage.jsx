
// Utilisation de Lucide pour les icônes
import { ProjectCard } from "../../components/projectCard";
import SideMenu from "../../components/sideMenu";
import LayoutHeader from "../../components/layoutHeader";


const HomePage = () => {
    return (
        <div className="flex h-screen w-full font-san bg-couleur3" >
            <SideMenu />
            <main className="flex-1 p-8 overflow-y-auto">
                <LayoutHeader layoutName={"Dashboard"}/>
                <section className="mb-10">
                    <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Lasts projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProjectCard name="ProjectName" />
                        <ProjectCard name="ProjectName" />
                    </div>
                </section>
            </main>
        </div>
    );
};







export default HomePage;