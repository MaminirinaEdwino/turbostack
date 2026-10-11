import { Folder, LayoutGrid, Plus } from "lucide-react";

export default function ProjectCard({ index, name, handleProjectSelection, handleDelete }) {
  return (
    <>
      {/* L'attribut popover accepte "auto" ou "manual" */}
      <div
        id={"popover-react-" + index}
        popover="auto"
        className="mx-auto my-auto border border-red-200 bg-white p-6 rounded-xl shadow-2xl backdrop-blur-md max-w-sm w-full outline-none transition-all duration-200"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-50 text-red-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 m-0">Confirmation</h4>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Confirm that you want to delete this project
        </p>

        {/* Boutons de fermeture optionnels avec popoverTargetAction */}
        <div className="flex items-center justify-end gap-3">
          <button
            popoverTarget={"popover-react-" + index}
            popoverTargetAction="hide"
            className="px-4.5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            popoverTarget={"popover-react-" + index}
            popoverTargetAction="hide"
            className="px-4.5 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm shadow-red-500/20 transition-all"
            onClick={() => handleDelete(name.nom)}
          >
            Confirm {name.nom} 
          </button>
        </div>
      </div>
      <div
        key={index}
        onDoubleClick={() => handleProjectSelection(name.nom)}
        className="group bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:border-couleur1/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col relative overflow-hidden dark:border-none"
      >
        {/* Background Decoration */}

        <div className="absolute -right-4 -top-4 w-24 h-24 bg-couleur1/5 dark:bg-couleur3/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

        <div className="w-14 h-14 rounded-xl bg-couleur3 flex items-center justify-center text-couleur1 mb-6 group-hover:bg-couleur1 group-hover:text-white transition-all duration-300 shadow-inner dark:bg-couleur1/50 dark:text-couleur3">
          <Folder size={28} />
        </div>

        <h3 className="text-xl font-bold text-couleur1 truncate mb-2 dark:text-couleur3/80">
          {name.nom}
        </h3>
        <p className="text-sm text-couleur1/50 line-clamp-2 mb-6 dark:text-couleur3/30">
          {/* Open workspace to configure API endpoints and database schema. */}
          {name.description}
        </p>

        <div className="mt-auto pt-4 border-t border-couleur1/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-couleur1 opacity-40 text-[10px] font-bold uppercase tracking-wider dark:text-couleur3/80">
            <LayoutGrid size={12} /> {name.type}
          </div>

          <button className="text-couleur1 opacity-0 z-10 group-hover:opacity-100 transition-opacity font-bold text-xs flex items-center gap-1 hover:cursor-copy" popoverTarget={"popover-react-" + index}>
            Delete <Plus size={14} className="rotate-45" />
          </button>

        </div>
      </div>
    </>
  );
}
