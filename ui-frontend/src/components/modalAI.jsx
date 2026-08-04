import React, { useState } from "react";

export default function AiChatModal({ isOpen, onClose }) {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Bonjour ! Je suis l'assistant TurboStack. Comment puis-je vous aider aujourd'hui ?",
            time: "10:00"
        }
    ]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!prompt.trim()) return;

        // Ajout du message utilisateur
        const userMsg = {
            sender: "user",
            text: prompt,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        const currentPrompt = prompt;
        setPrompt("");

        // Simulation de la réponse IA (À remplacer par votre appel API / WebSocket Go)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: `Résultat généré pour : "${currentPrompt}"`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 1000);
    };

    return (
        /* Arrière-plan flouté (Backdrop) */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 transition-all h-full">

            {/* Conteneur principal de la Modal */}
            <div className="relative w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-couleur1 shadow-2xl overflow-hidden transition-colors">

                {/* En-tête (Header) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-couleur6 text-white font-bold shadow-md shadow-indigo-500/20">
                            🤖
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                                Assistant TurboStack
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Générateur & Modélisateur IA
                            </p>
                        </div>
                    </div>

                    {/* Bouton Fermer */}
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                {/* Zone de Visualisation des Résultats (Fil de discussion) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/40">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                                }`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                        ? "bg-couleur2 text-white rounded-br-none"
                                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                                {msg.time}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Formulaire de Saisie du Prompt & Bouton d'envoi */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-indigo-400 transition-all"
                    >
                        {/* Champ de Saisie de Prompt */}
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Décrivez ce que vous souhaitez générer..."
                            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                        />

                        {/* Bouton d'Envoi */}
                        <button
                            type="submit"
                            disabled={!prompt.trim()}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-couleur1 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                        >
                            <span>Envoyer</span>
                            <svg
                                className="w-4 h-4 rotate-90"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}