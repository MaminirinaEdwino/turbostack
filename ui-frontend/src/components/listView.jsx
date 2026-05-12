import LayoutHeader from "./layoutHeader";

export default function ListView({ content, elementView, newIcon, sectionName, newText, listIcon }) {
    
    return <main className="flex-1 p-8 overflow-y-auto">
        <LayoutHeader layoutName={sectionName} />
        <div className="projectSection flex flex-wrap">
            {content.map((item) => elementView(item, listIcon))}
        </div>
        <button className="fixed bottom-3 text-couleur1 w-fit flex flex-col items-center border border-white hover:border-couleur1 rounded-lg p-2 transition-delay-100 transition-all bg-couleur3">
            {newIcon}
            <span>{newText}</span>
        </button>
    </main>
}