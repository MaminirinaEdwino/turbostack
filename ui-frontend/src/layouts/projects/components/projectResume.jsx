import { Database, Settings, WebhookIcon } from "lucide-react";
import { PiBrowserFill } from "react-icons/pi";

export default function ProjectResume({nom, type, description}){
    return <div
    className="text-couleur1">
    <p className="font-semibold text-2xl flex items-center gap-2" title={description}>{nom} 
        {type == "api"&& <Settings></Settings>}
        {type == "webapp"&& <PiBrowserFill></PiBrowserFill>}
        {type == "static"&& <WebhookIcon></WebhookIcon>}
        {type == "bdd"&& <Database></Database>}
    </p>
    
    </div>
}