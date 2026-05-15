import React from 'react';
import { BLOCK_TYPES } from '../defaultVar';
import { Puzzle } from 'lucide-react';

export default function BlockTab({ blocks, renderBlocksList, addBlock, availableComponents }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Types de Blocs Standard */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black uppercase text-couleur1/40">Blocs Standard</h3>
                <div className="grid grid-cols-2 gap-3">
                    {BLOCK_TYPES.map((type, index) => (
                        <button
                            key={index}
                            onClick={() => addBlock(type)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                        >
                            {type.icon}
                            <span className="text-sm font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Composants Disponibles */}
            {availableComponents && availableComponents.length > 0 && (
                <div className="flex flex-col gap-3 mt-6">
                    <h3 className="text-xs font-black uppercase text-couleur1/40 flex items-center gap-2">
                        <Puzzle size={14} /> Composants
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {availableComponents.map((comp, index) => (
                            <button
                                key={index}
                                onClick={() => addBlock(comp, true)}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1"
                            >
                                <Puzzle size={14} /> {/* Icône Puzzle pour les composants */}
                                <span className="text-sm font-medium">{comp.nom}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Structure de la Page */}
            <div className="flex flex-col gap-3 mt-6">
                <h3 className="text-xs font-black uppercase text-couleur1/40">Structure de la Page</h3>
                <div className="bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 rounded-xl p-3">
                    {blocks.length === 0 ? (
                        <p className="text-couleur1/50 text-sm italic">Aucun bloc pour le moment. Ajoutez-en !</p>
                    ) : (
                        renderBlocksList(blocks)
                    )}
                </div>
            </div>
        </div>
    );
}