import { useNavigate, useNavigateProject } from "../hooks/useNavigate";
import LayoutHeader from "./layoutHeader";

export default function ListView({ content, elementView, newIcon, sectionName, newText, listIcon }) {
    const navigateTo = useNavigate();
    const navigateToProject = useNavigateProject();
    return <main className="flex-1 p-8 overflow-y-auto">
        <LayoutHeader layoutName={sectionName} />
        <div className="projectSection flex flex-wrap">
            {content.map((item) => elementView(item, listIcon, navigateToProject))}
        </div>
        <button onClick={()=>navigateTo("New Project")} className="fixed bottom-3 text-couleur1 w-fit flex flex-col items-center border border-white hover:border-couleur1 rounded-lg p-2 transition-delay-100 transition-all bg-couleur3">
            {newIcon}
            <span>{newText}</span>
        </button>
    </main>
}