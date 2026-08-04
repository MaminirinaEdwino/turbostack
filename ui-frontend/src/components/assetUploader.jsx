import { useEffect, useState } from "react"
import { GoApp } from "../services/bridge"
import FileNode from "./fileNode"
import { Check } from "lucide-react"
import { useSelector } from "react-redux"

export default function AssetUploaderModal({reloadAsset}) {
    const [folder, setFolder] = useState("")
    const [selectedFile, setSelectedFile] = useState("")
    const [fileList, setFileList] = useState([])
    const [base64Image, setBase64Image] = useState("")
    const projectName = useSelector(state => state.app.actualProject)
    useEffect(() => {
        const loadFile = async () => {
            const res = await GoApp.fetChFileForUpload(folder)
            setFileList(res)
        }
        loadFile()
    }, [folder])
    useEffect(() => {
        const loadBase64 = async () => {
            const res = await GoApp.getImageAsBase64(selectedFile.path)
            setBase64Image(res)
        }
        loadBase64()
    }, [selectedFile])
    const uploadFile = async () => {
        await GoApp.uploadAsset(projectName, selectedFile.name, base64Image)
        // alert(res)
        reloadAsset()
    }
    return <div className="h-fit overflow-scroll fixed w-[75%] p-3 rounded border border-couleur2 backdrop-blur-md shadow-2xl flex flex-col gap-4 text-slate-700 transition-all top-10 dark:text-couleur3 dark:bg-gray-950">
        {projectName}
        <h2>Choose file to Upload</h2>
        <h3>
            {folder == "" ? "~/" : folder.split("/").map((fold, idx) => <>
                {fold != "" && <button className="cursor-pointer p-1 bg-couleur2/10 rounded mx-1 hover:bg-couleur2/50" onClick={() => {
                    let path = ""
                    folder.split("/").map((fld, i) => {
                        if (i <= idx) {
                            path += "/" + fld
                        }
                    })
                    setFolder(path)
                }}>/{fold}</button>}
            </>)}

        </h3>
        <div className="flex space-between gap-5">
            <div className="w-[70%] h-80">
                {selectedFile && (
                    <div className="flex gap-1 justify-between">
                        <div className="text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-couleur1 px-3 py-1.5 rounded-md flex items-center justify-between">
                            <span>Selected: <strong className="">{selectedFile.path}</strong></span>
                        </div>
                        <button onClick={()=>uploadFile()} className="cursor-pointer hover:bg-couleur1 p-1 px-2 hover:text-couleur3 rounded transition-all duration-300"><Check size={14} /></button>
                    </div>
                )}
                <div className="h-[90%] w-full overflow-scroll">
                    {fileList.map((file, idx) => <FileNode
                        key={file.name + idx}
                        setFolder={setFolder}
                        fileNode={file}
                        setSelectedFile={setSelectedFile}
                    />)}
                </div>
            </div>
            {base64Image != "" && (
                <div className="w-1/3 h-full flex flex-col items-center justify-center p-2 rounded-lg border border-couleur2/30  backdrop-blur-sm">
                    {/* <span className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Preview</span> */}
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md ">
                        <img
                            src={base64Image}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain shadow-lg rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
}