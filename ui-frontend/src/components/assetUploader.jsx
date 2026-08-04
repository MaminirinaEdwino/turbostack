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
            console.log(res)
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
        <iframe src="" frameborder="0" srcDoc={`<!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">

                                            <style>
                                                body { margin: 0; padding: 0; min-height: 100vh; font-family: sans-serif; }
                                                img { max-width: 100%; height: auto; }
                                                
                                            </style>
                                        </head>
                                        <body><img src="file:/${selectedFile}"/></body>
                                    </html>`}></iframe>
    </div>
}