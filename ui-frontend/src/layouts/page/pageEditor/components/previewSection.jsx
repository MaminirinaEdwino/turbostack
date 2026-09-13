import { Monitor, MonitorUp, PanelLeftOpen, PanelRightOpen, Smartphone, Tablet } from "lucide-react";

export default function PreviewSection({ isLeftSidebarOpen, isRightSidebarOpen, setIsLeftSidebarOpen, setIsRightSidebarOpen, setViewport, handleDetachPreview, handleResetZoom, handleZoomIn, handleZoomOut, zoomLevel, previewHtml, globalCss, blocksCss, viewport }) {
    return <div
        className={`flex-1 absolute w-fit flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-couleur1/10 shadow-2xl overflow-hidden h-[calc(100vh-140px)] transition-all duration-300 ${isLeftSidebarOpen ? "ml-80" : ""} ${isRightSidebarOpen ? "mr-96" : ""}`}
    >
        {!isLeftSidebarOpen && (
            <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className="fixed  z-10 p-3 -left-8 hover:left-1 delay-200 transition-all bg-couleur1 text-white rounded-full shadow-lg hover:scale-105"
            >
                <PanelLeftOpen size={20} />
            </button>
        )}
        {!isRightSidebarOpen && (
            <button
                onClick={() => setIsRightSidebarOpen(true)}
                className="fixed -right-8 hover:right-1 delay-200 top-24 z-10 p-3 bg-couleur1 text-white rounded-full shadow-lg hover:scale-105 transition-all "
            >
                <PanelRightOpen size={20} />
            </button>
        )}
        <div className=" h-[80vh] overflow-scroll fixed  w-fit shadow-lg shadow-gray-600 rounded-lg ">
            <div className="p-4 bg-white/50 backdrop-blur-2xl dark:bg-gray-800/50 border-b border-couleur1/5 flex items-center justify-between sticky top-0 z-10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/40"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/40"></div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Sélecteurs de Viewport */}
                    <div className="flex items-center bg-white/50 dark:bg-gray-800 rounded-lg p-1 shadow-inner border border-couleur1/5">
                        <button
                            onClick={() =>
                                setViewport({
                                    width: "375px",
                                    height: "667px",
                                    name: "mobile",
                                })
                            }
                            className={`p-1.5 rounded-md transition-all ${viewport.name === "mobile" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                            title="Mobile (375x667)"
                        >
                            <Smartphone size={14} />
                        </button>
                        <button
                            onClick={() =>
                                setViewport({
                                    width: "768px",
                                    // height: "1024px",
                                    name: "tablet",
                                })
                            }
                            className={`p-1.5 rounded-md transition-all ${viewport.name === "tablet" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                            title="Tablette (768x1024)"
                        >
                            <Tablet size={14} />
                        </button>
                        <button
                            onClick={() =>
                                setViewport({
                                    width: "1280px",
                                    // height: "720px",
                                    name: "desktop",
                                })
                            }
                            className={`p-1.5 rounded-md transition-all ${viewport.name === "desktop" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
                            title="Bureau (Plein écran)"
                        >
                            <Monitor size={14} />
                        </button>
                    </div>

                    <span className="text-[10px] font-bold text-couleur1/40 uppercase tracking-widest">
                        Preview
                    </span>
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleZoomOut}
                            className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                        >
                            -
                        </button>
                        <span className="text-sm font-medium text-couleur1 dark:text-gray-300">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={handleZoomIn}
                            className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                        >
                            +
                        </button>
                        <button
                            onClick={handleResetZoom}
                            className="ml-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="w-12 flex items-center px-2">
                    <div>
                        <button title="separete the preview" onClick={handleDetachPreview}>
                            <MonitorUp size={15} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-scroll flex justify-center items-start bg-gray-100 dark:bg-gray-800/30  custom-scrollbar h-full" >
                <iframe
                    title="Page Preview"
                    style={{
                        width: viewport.width,
                        // height: viewport.height,
                        transform: `scale(${zoomLevel})`, 
                        transformOrigin: "top center", 
                        overflow: "scroll"
                    }}
                    className="bg-white shadow-2xl transition-all duration-500 ease-in-out rounded-sm h-full "
                    srcDoc={`
                                    <!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <style>
                                                body { margin: 0; padding: 0; min-height: 100vh; font-family: sans-serif; }
                                                img { max-width: 100%; height: auto; }
                                                ${globalCss}
                                                ${blocksCss}
                                            </style>
                                        </head>
                                        <body>${previewHtml}</body>
                                    </html>
                                `}
                />
            </div>
        </div>
    </div>
}