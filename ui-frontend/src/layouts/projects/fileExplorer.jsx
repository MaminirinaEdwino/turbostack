import React, { useState, useEffect } from "react";

import { GoApp } from "../../services/bridge";
import { useNavigate } from "../../hooks/useNavigate";
import FileExplorerDirectory from "./fileExplorerDirectory";
import FileExplorerHeader from "./fileExplorerHeader";

const FileNode = ({ node, level, onFileClick, selectedPath }) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (node.is_dir) {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <div className="select-none">
      <FileExplorerDirectory
        handleClick={handleClick}
        isOpen={isOpen}
        level={level}
        node={node}
        selectedPath={selectedPath}
      ></FileExplorerDirectory>
      {node.is_dir && isOpen && hasChildren && (
        <div className="animate-in slide-in-from-left-1 duration-200">
          {node.children.map((child) => (
            <FileNode
              key={child.path}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileExplorer({ projectName }) {
  console.log("teste explorer");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const loadFiles = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setLoading(true);
    try {
      const res = await GoApp.fetchProjectFiles(projectName);
      setFiles(res || []);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (path) => {
    setSelectedPath(path);
    setContent("Chargement...");
    try {
      const res = await GoApp.getFileContent(projectName, path);
      setContent(res);
    } catch (err) {
      setContent("Erreur : " + err);
    }
  };

  useEffect(() => {
    if (projectName) loadFiles();
  }, [projectName]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-4xl border border-couleur1/10 shadow-sm overflow-hidden">
      <FileExplorerHeader
        loadFiles={loadFiles}
        loading={loading}
        navigate={navigate}
      ></FileExplorerHeader>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Arborescence */}
        <div className="w-1/3 border-r border-couleur1/10 overflow-y-auto p-4 custom-scrollbar bg-couleur3/5 dark:bg-black/10">
          {!loading && files.length > 0 ? (
            <div className="space-y-0.5">
              {files.map((node) => (
                <FileNode
                  key={node.path}
                  node={node}
                  level={0}
                  onFileClick={handleFileClick}
                  selectedPath={selectedPath}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-sm">
                No files exported yet
              </div>
            )
          )}
        </div>

        {/* Main: Visionneuse de contenu */}
        <div className="w-2/3 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
          {selectedPath ? (
            <pre className="flex-1 overflow-auto p-6 text-xs font-mono text-couleur1/80 leading-relaxed custom-scrollbar whitespace-pre">
              {content}
            </pre>
          ) : (
            <div className="flex-1 flex items-center justify-center text-couleur1/20 italic text-sm">
              Selectionnez un fichier pour voir son contenu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
