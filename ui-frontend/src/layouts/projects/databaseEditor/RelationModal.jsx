import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function RelationModal({ models, onSelectRelation, onClose }) {
    const [selectedModelName, setSelectedModelName] = useState('');
    const [selectedFieldName, setSelectedFieldName] = useState('');

    const handleModelChange = (e) => {
        setSelectedModelName(e.target.value);
        setSelectedFieldName(''); // Réinitialiser la sélection de champ lorsque le modèle change
    };

    const handleFieldChange = (e) => {
        setSelectedFieldName(e.target.value);
    };

    const handleConfirm = () => {
        if (selectedModelName && selectedFieldName) {
            onSelectRelation(`relation:${selectedModelName}.${selectedFieldName}`);
            onClose();
        } else {
            alert('Veuillez sélectionner un modèle cible et un champ.');
        }
    };

    const targetModel = models.find(m => m.nom === selectedModelName);

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96">
                <h3 className="text-xl font-bold text-couleur1 mb-4">Sélectionner la cible de la relation</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modèle cible</label>
                    <select
                        className="w-full p-2 border border-couleur1/30 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={selectedModelName}
                        onChange={handleModelChange}
                    >
                        <option value="">Sélectionner un modèle</option>
                        {models.map(model => (
                            <option key={model.nom} value={model.nom}>{model.nom}</option>
                        ))}
                    </select>
                </div>

                {selectedModelName && targetModel && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Champ cible</label>
                        <select
                            className="w-full p-2 border border-couleur1/30 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={selectedFieldName}
                            onChange={handleFieldChange}
                        >
                            <option value="">Sélectionner un champ</option>
                            {targetModel.champs.map(field => (
                                <option key={field.nom} value={field.nom}>{field.nom} ({field.type})</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-couleur1 text-couleur1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-couleur1 text-white font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all"
                    >
                        <Check size={18} /> Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}