import React, { useEffect, useState } from 'react';
import { BLOCK_TYPES } from '../defaultVar';
import { Blocks, File, Form, FormIcon, ListTree, Palette, Pen, Pencil, Puzzle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { GoApp } from '../../../../services/bridge';

export default function BlockTab({ blocks, renderBlocksList, addBlock, availableComponents, setGlobalStyle, editingtype, activePage }) {
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
            <div className='sticky flex gap-2 text-couleur1 top-1 w-full justify-between p-1.5 bg-white px-3 shadow-lg drop-shadow-white rounded items-center z-10'>
                <a href="#sb" onClick={() => setActualTab("sb")} className={`${actualTab == "sb" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
                    <Blocks size={16} />
                </a>
                <a href="#components" onClick={() => setActualTab("components")} className={`${actualTab == "components" ? "bg-couleur1 text-couleur3 p-1 rounded " : "bg-transparent"} transition-all duration-500`}>
                    <Puzzle size={16} />
                </a>
                <a href="#pagelib" onClick={() => { setActualTab("pagelib") }} className={`${actualTab == "pagelib" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
                    <File size={16} />
                </a>
                <a href="#stylelib" onClick={() => { setActualTab("stylelib") }} className={`${actualTab == "stylelib" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
                    <Palette size={16} />
                </a>
                <a href="#apiform" onClick={() => { setActualTab("apiform") }} className={`${actualTab == "apiform" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
                    <FormIcon size={16} />
                </a>
                <a href="#structure" onClick={() => { setActualTab("structure") }} className={`${actualTab == "structure" ? "bg-couleur1 text-couleur3 p-1 rounded" : "bg-transparent"} transition-all duration-500`}>
                    <ListTree size={16} />
                </a>
            </div>
            {actualTab == "sb" && <div className="flex flex-col gap-3" id='sb'>

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
            </div>}

            {/* Composants Disponibles */}

            {actualTab == "components" && <div className="flex flex-col gap-3 " id='components'>
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
            </div>}


            {
                pageLib?.length > 0 && actualTab == "pagelib" && (
                    <div className='flex flex-col gap-3' id='pagelib'>
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
                editingtype == "page" && styleLib?.length > 0 && actualTab == "stylelib" && (
                    <div className='flex flex-col gap-3' id='stylelib'>
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
                                            <Palette size={14} /> {/* Icône Puzzle pour les composants */}
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
            {
                actualTab == "apiform" && <div id='apiform'>
                    <h3 className='text-xs font-black uppercase text-couleur1/40 ' onClick={() => setActualTab("apiform")}>API Forms and request element</h3>
                    {actualTab == "apiform" && <div className='grid grid-cols-2 gap-2'>
                        {typeof (project) != "string" && project.rest_api.endpoints != null && <>
                            {((project.rest_api.endpoints).filter(ep => ep.method !== "GET")).map(ep => <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm'
                                onClick={() => addBlock({ isFormPost: true, tag: "form", uri: ep.uri, defaultContent: "", models: ep.model })}
                            > <Form size={14}></Form> {ep.nom}</button>)}

                            {((project.rest_api.endpoints).filter(ep => ep.return_page === activePage.nom))[0].model.map(mdl => <>
                                {((project.rest_api.endpoints).filter(ep => ep.return_page === activePage.nom))[0].return_content_type == "array" && <>
                                    <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm' onClick={() => addBlock({ tag: "div", defaultContent: `{{ range .${mdl.nom[0].toUpperCase()}${[mdl.nom.split(mdl.nom[0])[1]]} }}` })}> <Form size={14}></Form>{mdl.nom} range .{mdl.nom[0].toUpperCase()}{[mdl.nom.split(mdl.nom[0])]}</button>
                                    <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm' onClick={() => addBlock({ tag: "div", defaultContent: `{{ else }}`, isTemplateElement: true })}> <Form size={14}></Form> else </button>
                                    <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm' onClick={() => addBlock({ tag: "div", defaultContent: `{{ end }}`, isTemplateElement: true })}> <Form size={14}></Form> end range</button>
                                    {mdl.champs.map(champs => <>
                                        <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm'
                                            onClick={() => addBlock({ tag: "div", defaultContent: `{{ .${champs.nom[0].toUpperCase()}${champs.nom.split(champs.nom[0])[1]} }}`, isTemplateElement: true })}> <Form size={14}></Form> {mdl.nom}  {champs.nom[0].toUpperCase()}{champs.nom.split(champs.nom[0])[1]} </button>
                                    </>)}
                                </>}
                                {/* <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm'

                                > <Form size={14}></Form> {mdl.nom}</button> */}
                                {/* {((project.rest_api.endpoints).filter(ep => ep.return_page === activePage.nom))[0].return_content_type} */}
                            </>)}

                        </>}

                    </div>}

                </div>
            }


            {/* Structure de la Page */}
            {actualTab == "structure" && <div className="flex flex-col gap-3 " id='structure'>
                <h3 className="text-xs font-black uppercase text-couleur1/40" onClick={() => setActualTab("structure")}>Page Structure</h3>
                {actualTab == "structure" && <div className="bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 rounded-xl p-3">
                    {blocks.length === 0 ? (
                        <p className="text-couleur1/50 text-sm italic">Aucun bloc pour le moment. Ajoutez-en !</p>
                    ) : (
                        renderBlocksList(blocks)
                    )}
                </div>}
            </div>}
        </div>
    );
}