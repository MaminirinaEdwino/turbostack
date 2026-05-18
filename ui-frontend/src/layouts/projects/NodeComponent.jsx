import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LucidePuzzle, Edit3 } from 'lucide-react';

export default function NodeComponent({ data }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-couleur1/20 rounded-lg shadow-md p-4 w-64">
            <Handle type="target" position={Position.Left} className="!bg-couleur1/50" />
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <LucidePuzzle size={18} className="text-couleur1" />
                    <h3 className="font-bold text-couleur1 text-sm">{data.label}</h3>
                </div>
                <button onClick={() => data.onEdit?.()} className="p-1.5 hover:bg-couleur1/10 rounded-md text-couleur1 transition-colors" title="Modifier le composant">
                    <Edit3 size={14} />
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Type: UI Component</p>
            {data.generatedFromEndpoint && (
                <p className="text-xs text-gray-700 dark:text-gray-300">Generated from: <span className="font-semibold">{data.generatedFromEndpoint}</span></p>
            )}
            <Handle type="source" position={Position.Right} className="!bg-couleur1/50" />
        </div>
    );
}