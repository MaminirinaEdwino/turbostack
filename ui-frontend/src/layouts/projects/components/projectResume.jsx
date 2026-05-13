import { Database, Settings, WebhookIcon } from "lucide-react";
import { PiBrowserFill } from "react-icons/pi";

export default function ProjectResume({nom, type, description}){
    return <div
    className="text-couleur1">
    <p className="font-semibold text-2xl flex items-center gap-2">{nom} 
        {type == "api"&& <Settings></Settings>}
        {type == "webapp"&& <PiBrowserFill></PiBrowserFill>}
        {type == "static"&& <WebhookIcon></WebhookIcon>}
        {type == "bdd"&& <Database></Database>}
    </p>
    
    <details className="text-couleur6">
        <summary className="cursor-pointer">Description</summary>
        <p className="text-sm">{description} </p>
    </details>
    
    </div>
}