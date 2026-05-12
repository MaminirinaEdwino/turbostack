
// Utilisation de Lucide pour les icônes
import { ProjectCard } from "../../components/projectCard";
import { StatCard } from "../../components/statCard";
import SideMenu from "../../components/sideMenu";
import { Database, Settings, Folder } from "lucide-react";
import LayoutHeader from "../../components/layoutHeader";


const HomePage = () => {
    return (
        <div className="flex h-screen w-full font-san bg-couleur3" >

            {/* --- SIDEBAR --- */}
            <SideMenu />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <LayoutHeader layoutName={"Dashboard"}/>

                {/* --- LAST PROJECTS --- */}
                <section className="mb-10">
                    <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Lasts projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProjectCard name="ProjectName" />
                        <ProjectCard name="ProjectName" />
                    </div>
                </section>

                {/* --- STATISTICS --- */}
                {/* <section className="mb-10">
                    <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Components" total="5" icon={<Settings size={32} />} />
                        <StatCard title="Projects" total="5" icon={<Folder size={32} />} />
                        <StatCard title="Models" total="5" icon={<Database size={32} />} />
                    </div>
                </section> */}

                {/* --- DEPLOYED STATS --- */}
                {/* <section>
                    <h2 className="text-xl mb-4 opacity-60 text-couleur6" >Deployed Project Statistics</h2>
                    <div className="flex justify-around items-center p-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-48 h-48 rounded-full border-16 border-gray-100 rotate-45 border-t-couleur1 border-r-couleur2" ></div>
                        <div className="w-48 h-48 rounded-full border-16 border-gray-100 -rotate-12 border-t-couleur1 border-r-couleur2" ></div>
                    </div>
                </section> */}
            </main>
        </div>
    );
};

// --- SOUS-COMPOSANTS ---





export default HomePage;