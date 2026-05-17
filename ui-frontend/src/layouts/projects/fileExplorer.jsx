import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, HardDrive, RefreshCw, ChevronLeftCircle } from 'lucide-react';
import { GoApp } from '../../services/bridge';
import { useNavigate } from '../../hooks/useNavigate';

const FileNode = ({ node, level }) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="select-none">
            <div 
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-couleur1/5 cursor-pointer rounded-lg transition-colors group"
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-4 h-4 flex items-center justify-center">
                    {node.is_dir && (
                        <span className="text-couleur1/40">
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    )}
                </div>
                {node.is_dir ? (
                    <Folder size={16} className="text-couleur1 fill-couleur1/10" />
                ) : (
                    <File size={16} className="text-couleur1/60" />
                )}
                <span className={`text-sm truncate ${node.is_dir ? 'font-bold text-couleur1' : 'text-couleur1/80'}`}>
                    {node.name}
                </span>
                {!node.is_dir && (
                    <span className="text-[9px] opacity-0 group-hover:opacity-40 ml-auto font-mono whitespace-nowrap bg-couleur1/10 px-1 rounded">
                        {(node.size / 1024).toFixed(1)} KB
                    </span>
                )}
            </div>
            {node.is_dir && isOpen && hasChildren && (
                <div className="animate-in slide-in-from-left-1 duration-200">
                    {node.children.map((child) => (
                        <FileNode key={child.path} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function FileExplorer({ projectName }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const loadFiles = async () => {
        setLoading(true);
        try {
            // Note: Assurez-vous d'ajouter fetchProjectFiles dans votre bridge.js
            const res = await GoApp.fetchProjectFiles(projectName);
            setFiles(res || []);
        } catch (error) {
            console.error("Error loading files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectName) loadFiles();
    }, [projectName]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-[2rem] border border-couleur1/10 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-couleur1/10 bg-couleur3/5 dark:bg-white/5 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div onClick={()=>navigate('Dashboard')} className="p-2 bg-couleur1/10 rounded-xl">
                        <ChevronLeftCircle size={20} className="text-couleur1" />
                    </div>
                    <div className="p-2 bg-couleur1/10 rounded-xl">
                        <HardDrive size={20} className="text-couleur1" />
                    </div>
                    <h2 className="font-black text-couleur1 text-sm uppercase tracking-wider">Project Explorer</h2>
                </div>
                <button onClick={loadFiles} className={`p-2 hover:bg-couleur1/10 rounded-full text-couleur1 transition-all ${loading ? 'animate-spin' : ''}`}>
                    <RefreshCw size={16} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {!loading && files.length > 0 ? (
                    <div className="space-y-0.5">
                        {files.map((node) => <FileNode key={node.path} node={node} level={0} />)}
                    </div>
                ) : !loading && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-sm">No files exported yet</div>
                )}
            </div>
        </div>
    );
}