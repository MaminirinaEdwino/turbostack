import { Loader2, Download } from "lucide-react";
import React from "react";

export default function ExportButton({ action, exporting, handleExport }) {
  return (
    <>
      <button
        key={action.id}
        onClick={() => handleExport(action.id)}
        disabled={exporting !== null}
        className={`flex flex-col items-start p-6 rounded-3xl border border-couleur1/5 bg-white dark:bg-couleur1/30 shadow-sm hover:shadow-xl hover:border-couleur1/20 transition-all group text-left relative overflow-hidden dark:shadow-white/5 ${exporting === action.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      >
        <div
          className={`p-3 rounded-2xl ${action.bg} ${action.color} mb-4 group-hover:scale-110 transition-transform duration-500 `}
        >
          {React.cloneElement(action.icon, { size: 24 })}
        </div>

        <h3 className="font-black text-couleur1 dark:text-white text-lg mb-1 ">
          {action.label}
        </h3>
        <p className="text-xs text-couleur1/40 font-medium leading-relaxed dark:text-white/20">
          {action.desc}
        </p>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-couleur1/60 dark:text-white/20">
          {exporting === action.id ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download
              size={14}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          )}
          {exporting === action.id ? "Exportation..." : "Exporter"}
        </div>

        {/* Décoration en arrière-plan */}
        <div className="absolute dark:text-white -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          {React.cloneElement(action.icon, { size: 120 })}
        </div>
      </button>
    </>
  );
}
