import React, { useEffect, useState } from 'react';
import { BLOCK_TYPES } from '../defaultVar';
import { Form, Puzzle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { GoApp } from '../../../../services/bridge';

export default function BlockTab({ blocks, renderBlocksList, addBlock, availableComponents }) {
    const projectName = useSelector((state) => state.app.actualProject)
    const [project, setProject] = useState("")
    const [pageLib, setPageLib] = useState([])
    const [compLib, setCompLib] = useState([])
    const [styleLib, setStyleLib] = useState([])
    useEffect(() => {
        const loadLib = async () => {
            const res = await GoApp.loadPageLibrairie()
            const res2 = await GoApp.loadCompLib()
            const res3 = await GoApp.loadStyleLib()
            // console.log(res)
            setPageLib(res)
            setCompLib(res2)
            setStyleLib(res3)
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
                <h3 className="text-xs font-black uppercase text-couleur1/40">Standard Blocks</h3>
                <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Composants Disponibles */}
            {availableComponents && availableComponents.length > 0 && (
                <div className="flex flex-col gap-3 mt-6">
                    <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2">
                        <Puzzle size={14} /> Components
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {availableComponents.map((comp, index) => (
                            <button
                                key={index}
                                onClick={() => addBlock(comp, true)}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                            >
                                <Puzzle size={14} /> {/* Icône Puzzle pour les composants */}
                                <span className="text-sm font-medium">{comp.nom}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {
                pageLib?.length > 0 && (
                    <div className='flex flex-col gap-3 mt-6'>
                        <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2">
                            <Puzzle size={14} /> default page Libs
                        </h3>
                        {pageLib?.length} form
                    </div>
                )
            }
            {
                styleLib?.length > 0 && <>
                    style lib
                </>
            }
            {
                compLib?.length > 0 && <>
                    comp lib
                </>
            }
            {/* Liste des endpoints form */}
            <div>
                <h3 className='text-xs font-black uppercase text-couleur1/40 mb-3'>Forms </h3>
                <div className='grid grid-cols-2'>
                    {typeof (project) != "string" && project.rest_api.endpoints != null && <>
                        {((project.rest_api.endpoints).filter(ep => ep.method === "POST")).map(ep => <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1'
                            onClick={() => addBlock({ isFormPost: true, tag: "form", uri: ep.uri, defaultContent: ep.nom + " post form", models: ep.model })}
                        > <Form size={14}></Form> {ep.nom}</button>)}
                    </>}
                </div>
            </div>

            {/* Structure de la Page */}
            <div className="flex flex-col gap-3 mt-6">
                <h3 className="text-xs font-black uppercase text-couleur1/40">Page Structure</h3>
                <div className="bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 rounded-xl p-3">
                    {blocks.length === 0 ? (
                        <p className="text-couleur1/50 text-sm italic">Aucun bloc pour le moment. Ajoutez-en !</p>
                    ) : (
                        renderBlocksList(blocks)
                    )}
                </div>
            </div>
        </div>
    );
}