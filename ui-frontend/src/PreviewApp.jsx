import { Monitor, Smartphone, Tablet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function PreviewApp() {
    //   const [content, setContent] = useState('<h1>En attente de contenu...</h1>');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [globalCss, setGlobalCss] = useState(null);
    const [blocksCss, setBlockCss] = useState(null)
    const [previewHtml, setPreviewHtml] = useState(null)
    const [viewport, setVP] = useState({
        width: "375px",
        height: "667px",
        name: "mobile",
    })
    const channel = new BroadcastChannel('turbostack_preview_channel');
    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.05, 2)); // Max zoom 200%
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.05, 0.5)); // Min zoom 50%
    };

    const handleResetZoom = () => {
        setZoomLevel(1); // Reset to 100%
    };

    const setViewport = (data) => {
        channel.postMessage({ type: "SET_VIEWPORT", viewport: data })
    }

    useEffect(() => {
        // Écoute les mises à jour envoyées par l'éditeur principal
        const channel = new BroadcastChannel('turbostack_preview_channel');

        channel.onmessage = (event) => {
            if (event.data && event.data.type === 'UPDATE_RENDER') {
                // setContent(event.data.html);
                setGlobalCss(event.data.globalCss);
                setBlockCss(event.data.blocksCss);
                setPreviewHtml(event.data.previewHtml);
                setVP(event.data.viewport)
            }
        };

        // Prévenir l'éditeur que le preview est ouvert et prêt
        channel.postMessage({ type: 'PREVIEW_READY' });

        return () => channel.close();
    }, []);

    return (
        <div className=" h-screen overflow-scroll w-full shadow-lg rounded-lg ">
            <div className="p-4 bg-white/50 backdrop-blur-2xl dark:bg-gray-800/50 border-b border-couleur1/5 flex items-center justify-between sticky top-0 z-10">
                
                <div className="flex items-center  w-full justify-between gap-4">
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
                            className={`p-1.5 rounded-md transition-all ${viewport?.name === "mobile" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
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
                            className={`p-1.5 rounded-md transition-all ${viewport?.name === "tablet" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
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
                            className={`p-1.5 rounded-md transition-all ${viewport?.name === "desktop" ? "bg-couleur1 text-white shadow-md" : "text-couleur1/40 hover:text-couleur1"}`}
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

                <div className="w-12">

                </div>
            </div>
            <div className="overflow-scroll flex justify-center items-start bg-gray-100 dark:bg-gray-800/30  custom-scrollbar h-full" >
                <iframe
                    title="Page Preview"
                    style={{
                        width: viewport?.width,
                        height: viewport?.height,
                        transform: `scale(${zoomLevel})`, // Correction ici
                        transformOrigin: "top center", // Correction ici
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
    );
}