import { Folder } from "lucide-react";

export default function AssetListCard(name) {
  return (
    <div
      key={name.file_name}
      className="group relative flex flex-col justify-between border border-couleur7 max-w-50 text-center m-2 rounded-xl p-2.5 text-couleur1 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden"
    >
      {/* Conteneur d'image avec ratio fixe, fond neutre et effet de zoom au survol */}
      <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center ring-1 ring-black/5 dark:ring-white/5">
        <img
          src={name.base_64_image}
          alt={name.file_name || "Asset"}
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* Nom du fichier tronqué avec gestion des noms longs et infobulle (title) */}
      <span
        title={name.file_name}
        className="text-xs font-medium tracking-tight truncate w-full px-1 block transition-colors duration-200 group-hover:opacity-100 opacity-90"
      >
        {name.file_name}
      </span>
    </div>
  );
}