import React, { useState } from 'react';
import { 
    Download, Database, Settings, Layout, Globe, 
    FileCode, Terminal, CheckCircle2, Loader2, AlertCircle,
    ArrowLeft 
} from 'lucide-react';
import { GoApp } from '../../services/bridge';
import { useNavigate } from '../../hooks/useNavigate';

export default function ProjectHomePage({ projectName }) {
    const navigateTo = useNavigate();
    const [exporting, setExporting] = useState(null);
    const [status, setStatus] = useState(null);

    const handleExport = async (type) => {
        setExporting(type);
        setStatus({ type: 'loading', message: `Génération du code ${type.toUpperCase()}...` });
        
        try {
            // Appel au backend Go pour l'exportation
            // On passe le nom du projet et le type d'export (api, models, frontend, all)
            await GoApp.exportProject(projectName, type); // On suppose que le backend gère le flag type
            setStatus({ type: 'success', message: `Le code ${type.toUpperCase()} a été exporté avec succès !` });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: `Erreur lors de l'exportation : ${error}` });
        } finally {
            setExporting(null);
        }
    };

    const exportActions = [
        { id: 'api', label: 'Backend API', desc: 'Code Go, Routes & Handlers', icon: <Settings />, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'models', label: 'DB Models', desc: 'Database table', icon: <Database />, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 'frontend', label: 'Frontend UI', desc: 'Composants React & Styles', icon: <Layout />, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'full', label: 'Full Stack', desc: 'Full stack web app', icon: <Terminal />, color: 'text-couleur1', bg: 'bg-couleur1/10' },
    ];

    return (
        <div className="p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigateTo("Project")}
                        className="group p-3 rounded-2xl border border-couleur1/10 bg-white dark:bg-gray-900 hover:bg-couleur1 transition-all shadow-sm"
                        title="Retour à la liste des projets"
                    >
                        <ArrowLeft size={20} className="text-couleur1 group-hover:text-white transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-couleur1 tracking-tight">Export </h1>
                        <p className="text-couleur1/50 font-medium">Handle export for <span className="text-couleur1 font-bold">"{projectName}"</span></p>
                    </div>
                </div>
            </div>
            {/* Grille d'actions d'exportation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exportActions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handleExport(action.id)}
                        disabled={exporting !== null}
                        className={`flex flex-col items-start p-6 rounded-3xl border border-couleur1/5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-couleur1/20 transition-all group text-left relative overflow-hidden ${exporting === action.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                    >
                        <div className={`p-3 rounded-2xl ${action.bg} ${action.color} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                            {React.cloneElement(action.icon, { size: 24 })}
                        </div>
                        
                        <h3 className="font-black text-couleur1 dark:text-white text-lg mb-1">{action.label}</h3>
                        <p className="text-xs text-couleur1/40 font-medium leading-relaxed">{action.desc}</p>
                        
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-couleur1/60">
                            {exporting === action.id ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            )}
                            {exporting === action.id ? 'Exportation...' : 'Exporter'}
                        </div>

                        {/* Décoration en arrière-plan */}
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            {React.cloneElement(action.icon, { size: 120 })}
                        </div>
                    </button>
                ))}
            </div>

            {/* Statistiques ou état rapide (Optionnel) */}
            {/* <div className="bg-couleur1/5 rounded-[2.5rem] p-8 border border-couleur1/10 flex items-center justify-between">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[10px] font-black uppercase text-couleur1/40 mb-1">Status du projet</p>
                        <div className="flex items-center gap-2 text-couleur1 font-bold">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Ready for Build
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-couleur1/30 italic text-sm font-medium">
                    <FileCode size={18} />
                    TurboStack Engine v1.0
                </div>
            </div> */}

            {/* Notification de statut */}
            {status && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${
                    status.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 
                    status.type === 'loading' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-green-50 border-green-100 text-green-700'
                }`}>
                    {status.type === 'loading' ? <Loader2 size={20} className="animate-spin" /> : status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <span className="font-bold text-sm">{status.message}</span>
                </div>
            )}
        </div>
    );
}