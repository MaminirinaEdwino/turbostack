import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings, Link as LinkIcon } from 'lucide-react';

export default function NodeApiEndpoint({ data }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-couleur1/20 rounded-lg shadow-md p-4 w-72">
            <Handle type="target" position={Position.Left} className="!bg-couleur1/50" />
            <div className="flex items-center gap-2 mb-2">
                <Settings size={18} className="text-couleur1" />
                <h3 className="font-bold text-couleur1 text-sm">{data.label}</h3>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                <p className="font-semibold">Method: <span className="font-normal">{data.method}</span></p>
                <p className="font-semibold">URI: <span className="font-normal">{data.uri}</span></p>
                <p className="font-semibold">Role: <span className="font-normal capitalize">{data.role}</span></p>
            </div>
            {data.associatedModels && data.associatedModels.length > 0 && (
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    <p className="font-semibold">Uses Models:</p>
                    <ul className="list-disc list-inside ml-2">
                        {data.associatedModels.map((modelName, idx) => (
                            <li key={idx}>{modelName}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Handle type="source" position={Position.Right} className="!bg-couleur1/50" />
        </div>
    );
}