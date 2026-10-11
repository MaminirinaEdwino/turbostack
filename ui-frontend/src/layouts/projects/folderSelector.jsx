import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { useSelector } from "react-redux"
import { GoApp } from "../../services/bridge"
import FileNode from "../../components/fileNode"

export default function FolderSelector({ onSelectFolder, onClose }) {
    const [folder, setFolder] = useState("")
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [fileList, setFileList] = useState([])
    const projectName = useSelector(state => state.app.actualProject)

    useEffect(() => {
        const loadFile = async () => {
            const res = await GoApp.fetChFileForUpload(folder)
            setFileList(res)
        }
        loadFile()
    }, [folder])

    const handleConfirm = () => {
        if (selectedFolder && onSelectFolder) {
            onSelectFolder(selectedFolder)
        }
        if (onClose) {
            onClose()
        }
    }

    return (
        <div className="h-fit overflow-scroll fixed w-[75%] p-5 rounded-xl border border-couleur2 backdrop-blur-md shadow-2xl flex flex-col gap-4 text-slate-700 transition-all top-10 bg-white/90 dark:text-couleur3 dark:bg-gray-950 z-50">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Choose Target Folder</h2>
                <span className="text-xs text-slate-400">Project: {projectName}</span>
            </div>

            {/* Fil d'Ariane (Breadcrumbs) */}
            <h3 className="text-sm font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded-md">
                {folder == "" ? "~/" : folder.split("/").map((fold, idx) => (
                    fold != "" && (
                        <button 
                            key={fold + idx}
                            className="cursor-pointer p-1 bg-couleur2/10 rounded mx-1 hover:bg-couleur2/50 transition-colors" 
                            onClick={() => {
                                let path = ""
                                folder.split("/").map((fld, i) => {
                                    if (i <= idx) {
                                        path += "/" + fld
                                    }
                                })
                                setFolder(path)
                            }}
                        >
                            /{fold}
                        </button>
                    )
                ))}
            </h3>

            <div className="flex flex-col gap-4">
                {/* Barre de validation du dossier sélectionné */}
                {selectedFolder && (
                    <div className="flex gap-1 justify-between items-center bg-emerald-500/10 border border-emerald-500/30 text-couleur1 px-4 py-2 rounded-lg">
                        <span className="text-xs font-mono">
                            Selected Folder: <strong>{selectedFolder}</strong>
                        </span>
                        <button 
                            onClick={handleConfirm} 
                            className="cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 p-1.5 px-3 rounded-md transition-all duration-300 flex items-center gap-1 text-xs font-medium shadow-sm"
                        >
                            <Check size={14} /> Confirm
                        </button>
                    </div>
                )}

                {/* Liste des répertoires */}
                <div className="h-80 w-full overflow-scroll border border-couleur2/20 rounded-lg p-2 bg-white/50 dark:bg-gray-900/50">
                    {fileList.map((file, idx) => (
                        <FileNode
                            key={file.name + idx}
                            setFolder={setFolder}
                            fileNode={file}
                            setSelectedFile={setSelectedFolder} // Réutilisé pour stocker le dossier sélectionné
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}