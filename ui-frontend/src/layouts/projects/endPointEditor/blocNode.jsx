import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code, Variable, Play, Box } from 'lucide-react';

const BlocNode = ({ data, isConnectable }) => {
  const isFunction = data.type === 'function';
  const isVariable = data.type === 'variable';

  return (
    <div className={`
      min-w-[180px] rounded-lg border-2 bg-white dark:bg-gray-900 shadow-xl overflow-hidden
      ${isFunction ? 'border-blue-500' : isVariable ? 'border-purple-500' : 'border-emerald-500'}
    `}>
      {/* Header */}
      <div className={`
        px-3 py-1.5 flex items-center justify-between gap-2 text-white font-bold text-xs
        ${isFunction ? 'bg-blue-500' : isVariable ? 'bg-purple-500' : 'bg-emerald-500'}
      `}>
        <div className="flex items-center gap-1.5">
          {isFunction ? <Play size={12} /> : isVariable ? <Variable size={12} /> : <Box size={12} />}
          <span>{data.label}</span>
        </div>
        <button className="hover:bg-white/20 rounded p-0.5 transition-colors">
          <Code size={10} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <div className="space-y-2">
          {data.params && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 italic">
              Params: {data.params}
            </div>
          )}
          {data.value !== undefined && (
            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded break-all">
              {String(data.value)}
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-900"
      />
    </div>
  );
};

export default memo(BlocNode);
