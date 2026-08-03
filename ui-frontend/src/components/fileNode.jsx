export default function FileNode({setFolder, fileNode, setSelectedFile}) {
    return <div>
        {fileNode.isDir ? <button onDoubleClick={()=>setFolder(fileNode.path)}>{fileNode.name}</button>: <button onDoubleClick={()=>setSelectedFile(fileNode.path)}>{fileNode.name}</button>}
        
    </div>
}