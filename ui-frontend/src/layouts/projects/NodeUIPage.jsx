import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LayoutDashboard, Link as LinkIcon } from 'lucide-react';

export default function NodeUIPage({ data }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-couleur1/20 rounded-lg shadow-md p-4 w-64">
            <Handle type="target" position={Position.Left} className="!bg-couleur1/50" />
            <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard size={18} className="text-couleur1" />
                <h3 className="font-bold text-couleur1 text-sm">{data.label}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">URI: {data.uri}</p>
            {data.boundEndpoints && data.boundEndpoints.length > 0 && (
                <div className="text-xs text-gray-700 dark:text-gray-300">
                    <p className="font-semibold">Bound to APIs:</p>
                    <ul className="list-disc list-inside ml-2">
                        {data.boundEndpoints.map((endpointName, idx) => (
                            <li key={idx}>{endpointName}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Handle type="source" position={Position.Right} className="!bg-couleur1/50" />
        </div>
    );
}