export default function FileNode({setFolder, fileNode, setSelectedFile}) {
    return <div>
        {fileNode.is_dir ? <button onDoubleClick={()=>setFolder(fileNode.path)}>{fileNode.name}</button>: <button onDoubleClick={()=>setSelectedFile(fileNode.path)}>{fileNode.name}</button>}
        
    </div>
}