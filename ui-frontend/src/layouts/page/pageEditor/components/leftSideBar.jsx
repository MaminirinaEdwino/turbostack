import { X } from "lucide-react";
import VisualEditor from "../visualEditor";

export default function LeftSideBar({isLeftSidebarOpen, setIsLeftSidebarOpen, editingType, selectedPageIndex, selectedComponentIndex, activeItem, siteData, compKey, activeBlock, setActiveBlock, updateActiveItemField, showToast, viewport}) {
    return <aside
        className={`fixed top-2 h-full z-50 transition-transform duration-300 ease-in-out ${isLeftSidebarOpen ? "left-0" : "-left-100"} w-80 bg-couleur3 dark:bg-gray-950 border-r border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto my-2 `}
    >
        <div className="flex justify-between items-center mb-6 sticky -top-6 bg-couleur3 z-10">
            <h2 className="text-sm font-black uppercase text-couleur1/80">
                Structure
            </h2>
            <button
                onClick={() => setIsLeftSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300"
            >
                <X size={18} />
            </button>
        </div>
        <VisualEditor
            key={`left-${editingType}-${editingType === "page" ? selectedPageIndex : selectedComponentIndex}`}
            content={activeItem?.content}
            availablePages={siteData?.pages || []}
            availableComponents={siteData?.[compKey] || []}
            activeBlock={activeBlock}
            setActiveBlock={setActiveBlock}
            activeTab="blocks"
            activeViewport={viewport.name}
            allowedTabs={["blocks"]}
            onChange={(blocks) => updateActiveItemField("content", blocks)}
            showToast={showToast}
            onPageStylesChange={(styles) =>
                updateActiveItemField("styles", styles)
            }

            editingtype={editingType}
            updateBlockStyle={updateActiveItemField}
            activePage={activeItem}
        />
    </aside>
}