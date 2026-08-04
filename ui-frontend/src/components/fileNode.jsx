import { Folder, ImageIcon } from "lucide-react";

export default function FileNode({ setFolder, fileNode, setSelectedFile }) {
    return <div>
        {fileNode.is_dir ?
            <button onDoubleClick={() => setFolder(fileNode.path)} className="flex gap-2 items-center"> <Folder size={14}/> {fileNode.name}</button>
            :
            <button onDoubleClick={() => setSelectedFile(fileNode)} className="flex gap-2 items-center">  <ImageIcon size={14}/>{fileNode.name}</button>
        }
    </div>
}