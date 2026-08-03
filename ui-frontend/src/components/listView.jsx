import { useState } from "react";
import { useNavigateProject } from "../hooks/useNavigate";
import AssetUploaderModal from "./assetUploader";
import LayoutHeader from "./layoutHeader";

export default function ListView({ content, elementView, newIcon, sectionName, newText, listIcon }) {
    const navigateToProject = useNavigateProject();
    const [showModal, setShowModal] = useState(false)
    return <main className="flex-1 p-8 overflow-y-auto">
        <LayoutHeader layoutName={sectionName} />
        <div className="projectSection flex flex-wrap">
            {content.length > 0 ? content.map((item) => elementView(item, listIcon, navigateToProject)) : <div>List Empty</div>}
        </div>
        {showModal &&
            <div >
                <AssetUploaderModal key={"asset_uploader"} />
            </div>}
        <button onClick={() => setShowModal(!showModal)} className="fixed bottom-3 text-couleur1 w-fit flex flex-col items-center border border-white hover:border-couleur1 rounded-lg p-2 transition-delay-100 transition-all bg-couleur3">
            {newIcon}
            <span>{newText}</span>
        </button>
    </main>
}