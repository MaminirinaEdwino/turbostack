import React, { useEffect, useState } from 'react';
import { BLOCK_TYPES } from '../defaultVar';
import { Form, Pen, Pencil, Puzzle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { GoApp } from '../../../../services/bridge';

export default function BlockTab({ blocks, renderBlocksList, addBlock, availableComponents, setGlobalStyle, editingtype }) {
    const projectName = useSelector((state) => state.app.actualProject)
    const [actualTab, setActualTab] = useState("structure")
    const [project, setProject] = useState("")
    const [pageLib, setPageLib] = useState([])
    const [compLib, setCompLib] = useState([])
    const [styleLib, setStyleLib] = useState([])
    useEffect(() => {
        const loadLib = async () => {
            const res = await GoApp.loadPageLibrairie()
            const res2 = await GoApp.loadCompLib()
            const res3 = await GoApp.loadStyleLib()
            let tmpres = []
            let tmpres2 = []
            let tmpres3 = []
            res.map(el => {
                let e = JSON.parse(el)
                tmpres.push(e)
            })
            res2.map(el => {
                let e = JSON.parse(el)
                tmpres2.push(e)
            })
            res3.map(el => {
                tmpres3.push(el)
            })
            setPageLib(tmpres)
            setCompLib(tmpres2)
            setStyleLib(tmpres3)
            // setStyleLib(res3)
        }
        loadLib()
    }, [])
    useEffect(() => {
        const loadProject = async () => {
            let res = await GoApp.fetchProjectByName(projectName)
            setProject(res)
        }
        loadProject()
    }, [projectName])
    return (
        <div className="flex flex-col gap-6 ">
            {/* Types de Blocs Standard */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black uppercase text-couleur1/40" onClick={() => setActualTab("sb")}>Standard Blocks</h3>
                {
                    actualTab == "sb" && <div className="grid grid-cols-2 gap-3">
                        {BLOCK_TYPES.map((type, index) => (
                            <button
                                key={index}
                                onClick={() => addBlock(type)}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                            >
                                {type.icon}
                                <span className="text-sm font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>
                }
            </div>

            {/* Composants Disponibles */}

            <div className="flex flex-col gap-3 ">
                <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2" onClick={() => setActualTab("components")}>
                    Components
                </h3>
                {
                    actualTab == "components" && <div className="grid grid-cols-2 gap-3">
                        {availableComponents.length > 0 && availableComponents.map((comp, index) => (
                            <button
                                key={index}
                                onClick={() => addBlock(comp, true)}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                            >
                                <Puzzle size={14} /> {/* Icône Puzzle pour les composants */}
                                <span className="text-sm font-medium max-w-full overflow-clip">{comp.nom}</span>
                            </button>
                        ))}
                        {
                            compLib?.length > 0 && <>
                                {compLib.map((comp, index) => (
                                    <button
                                        key={index}
                                        onClick={() => addBlock(comp, true)}
                                        className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                                        title={comp?.nom}
                                    >
                                        <Puzzle size={14} /> {/* Icône Puzzle pour les composants */}
                                        <span className="text-sm font-medium max-w-full overflow-clip text-clip ">{comp?.nom}</span>
                                    </button>
                                ))}
                            </>
                        }
                    </div>
                }
            </div>

            {
                pageLib?.length > 0 && (
                    <div className='flex flex-col gap-3'>
                        <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2" onClick={() => setActualTab("pagelib")}>
                            Page Content Libs
                        </h3>

                        {
                            actualTab == "pagelib" && <>
                                {pageLib?.map((comp, index) => (
                                    <>
                                        {
                                            comp?.nom != "" && <button
                                                key={index}
                                                onClick={() => addBlock(comp, true)}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                                            >
                                                <Puzzle size={14} /> {/* Icône Puzzle pour les composants */}
                                                <span className="text-sm font-medium">{comp?.nom}</span>
                                            </button>
                                        }</>
                                ))}
                            </>
                        }
                    </div>
                )
            }

            {
                editingtype == "page" && styleLib?.length > 0 && (
                    <div className='flex flex-col gap-3'>
                        <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2" onClick={() => setActualTab("stylelib")}>
                            Style Libs
                        </h3>

                        {
                            actualTab == "stylelib" && <div className='grid grid-cols-2 gap-3'>
                                {styleLib?.map((comp, index) => (
                                    <>
                                        <button
                                            key={index}
                                            onClick={() => setGlobalStyle(comp)}
                                            className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                                        >
                                            <Pencil size={14} /> {/* Icône Puzzle pour les composants */}
                                            <span className="text-sm font-medium">Style {index}</span>
                                        </button>
                                    </>
                                ))}
                            </div>
                        }
                    </div>
                )
            }
            {/* Liste des endpoints form */}
            <div>
                <h3 className='text-xs font-black uppercase text-couleur1/40 ' onClick={() => setActualTab("apiform")}>API Forms </h3>
                {actualTab == "apiform" && <div className='grid grid-cols-2'>
                    {typeof (project) != "string" && project.rest_api.endpoints != null && <>
                        {((project.rest_api.endpoints).filter(ep => ep.method === "POST")).map(ep => <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1'
                            onClick={() => addBlock({ isFormPost: true, tag: "form", uri: ep.uri, defaultContent: ep.nom + " post form", models: ep.model })}
                        > <Form size={14}></Form> {ep.nom}</button>)}
                    </>}
                </div>}
            </div>

            {/* Structure de la Page */}
            <div className="flex flex-col gap-3 ">
                <h3 className="text-xs font-black uppercase text-couleur1/40" onClick={() => setActualTab("structure")}>Page Structure</h3>
                {actualTab == "structure" && <div className="bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 rounded-xl p-3">
                    {blocks.length === 0 ? (
                        <p className="text-couleur1/50 text-sm italic">Aucun bloc pour le moment. Ajoutez-en !</p>
                    ) : (
                        renderBlocksList(blocks)
                    )}
                </div>}
            </div>
        </div>
    );
}