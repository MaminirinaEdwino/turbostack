export const ProjectCard = ({ name }) => (
    <div className="flex items-center gap-4 p-5 rounded-xl border shadow-sm border-couleur7 bg-couleur5">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl border-2 border-couleur1 text-couleur1" >
            PHP
        </div>
        <div className="flex flex-col">
            <span className="font-bold text-lg text-couleur1" >{name}</span>
            <span className="text-sm opacity-70">WebApp</span>
            <span className="text-xs opacity-50 mt-1">Last modif 2 days ago</span>
        </div>
    </div>
);