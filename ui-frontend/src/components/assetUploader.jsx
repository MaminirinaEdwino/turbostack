import { useEffect, useState } from "react"
import { GoApp } from "../services/bridge"
import FileNode from "./fileNode"

export default function AssetUploaderModal() {
    const [folder, setFolder] = useState("")
    const [selectedFile, setSelectedFile] = useState("")
    const [fileList, setFileList] = useState([])
    useEffect(() => {
        const loadFile = async () => {
            const res = await GoApp.fetChFileForUpload(folder)
            setFileList(res)
        }
        loadFile()
    }, [folder])
    return <div className="h-[60vh] overflow-scroll fixed w-[75%] p-3 rounded border border-couleur2 bg-couleur1/10">
        <h2>Choose file to Upload</h2>
        <h3>
            {folder == "" ? "~/" : folder.split("/").map((fold, idx)=><>
                {fold != "" && <button className="cursor-pointer" onClick={()=>{
                let path = ""
                folder.split("/").map((fld, i)=>{
                    if (i <= idx) {
                        path+="/"+fld
                    }
                })
                setFolder(path)
            }}>/{fold}</button>}
            </>)}
            
        </h3>
        {selectedFile}
        <div className="h-[90%] w-full overflow-scroll">
            {fileList.map((file, idx) => <FileNode key={file.name + idx} setFolder={setFolder} fileNode={file} setSelectedFile={setSelectedFile}/>)}
        </div>
        <img src={"file:/"+selectedFile} alt="" />
    </div>
}