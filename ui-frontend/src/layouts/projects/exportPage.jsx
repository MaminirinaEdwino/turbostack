import React, { useState } from "react";
import { Database, Settings, Layout, Terminal } from "lucide-react";
import { GoApp } from "../../services/bridge";
import { useNavigate } from "../../hooks/useNavigate";
import Exportheader from "./exportHeader";
import ExportButton from "./exportBtn";
import ExportNotification from "./exportNotification";
import DarkModeToggle from "../../components/darkModeToggle";
import FolderSelector from "./folderSelector";

export default function ProjectHomePage({ projectName }) {
  const navigateTo = useNavigate();
  const [exporting, setExporting] = useState(null);
  const [status, setStatus] = useState(null);
  const [folder, setFolder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const handleExport = async (type) => {
    setExporting(type);
    setStatus({
      type: "loading",
      message: `Génération du code ${type.toUpperCase()}...`,
    });

    try {
      // Appel au backend Go pour l'exportation
      // On passe le nom du projet et le type d'export (api, models, frontend, all)
      await GoApp.exportProject(projectName, type); // On suppose que le backend gère le flag type
      setStatus({
        type: "success",
        message: `Le code ${type.toUpperCase()} a été exporté avec succès !`,
      });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message: `Erreur lors de l'exportation : ${error}`,
      });
    } finally {
      setExporting(null);
    }
  };

  const exportActions = [
    {
      id: "api",
      label: "Backend API",
      desc: "Code Go, Routes & Handlers",
      icon: <Settings />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: "models",
      label: "DB Models",
      desc: "Database table",
      icon: <Database />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      id: "frontend",
      label: "Frontend UI",
      desc: "Composants React & Styles",
      icon: <Layout />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: "full",
      label: "Full Stack",
      desc: "Full stack web app",
      icon: <Terminal />,
      color: "text-couleur1",
      bg: "bg-couleur1/10",
    },
  ];

  return (
    <div className="p-10 h-screen dark:bg-gray-900 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DarkModeToggle></DarkModeToggle>
      <Exportheader
        navigateTo={navigateTo}
        projectName={projectName}
      ></Exportheader>
      <div className="flex flex-col gap-2 w-full max-w-md">
            <label className="text-sm font-medium text-gray-700">Select Export Folder</label>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    readOnly 
                    value={folder} 
                    placeholder="No folder selected..." 
                    className="flex-1 border border-couleur1/30 rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:outline-none"
                />
                <label className="bg-couleur1 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition-all shadow-sm" onClick={()=>setShowModal(true)}>
                    Browse
                   
                </label>
            </div>
        </div>
      {
        showModal && <FolderSelector onSelectFolder={setFolder} onClose={()=>setShowModal(false)}/>
      }
      {/* Grille d'actions d'exportation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exportActions.map((action) => (
          <ExportButton
            action={action}
            exporting={exporting}
            handleExport={handleExport}
          ></ExportButton>
        ))}
      </div>

      {/* Notification de statut */}
      {status && <ExportNotification status={status}></ExportNotification>}
      
    </div>
  );
}
