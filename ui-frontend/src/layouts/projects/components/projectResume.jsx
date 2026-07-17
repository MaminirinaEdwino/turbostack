import { Database, Globe, Settings } from "lucide-react";

export default function ProjectResume({ nom, type, description }) {
    return <div
        className="text-couleur1">
        {type != "web_app" && <p className="font-semibold text-2xl flex items-center gap-2" title={description}>{nom}
            {type == "api" && <Settings></Settings>}
            {type == "web_app" && <Globe></Globe>}
            {type == "static" && <Globe></Globe>}
            {type == "bdd" && <Database></Database>}
        </p>}
    </div>
}