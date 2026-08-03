import { useState } from "react"

export default function AssetUploaderModal({reloadAssetList}) {
    const [folder, setFolder] = useState("")
    const [selectedFile, setSelectedFile] = useState("")
    const [fileList, setFileList] = useState([])
    return <div>
        <h2>Choose file to Upload</h2>
        <input type="text" name="" id="" />

    </div>
}