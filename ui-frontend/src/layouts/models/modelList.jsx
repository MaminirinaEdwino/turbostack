import ListView from "../../components/listView"
import ProjectListCard from "../projects/projectListCard"
import SideMenu from "../../components/sideMenu"
import { Database, DatabaseIcon } from "lucide-react"

export default function BDDModelList(){
    const ComponentList = [
        "BDD Model 1",
        "BDD Model 2",
        "BDD Model 3",
        "BDD Model 4",
        "BDD Model 5"
    ]
    return <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu></SideMenu>
        <ListView
            listIcon={<DatabaseIcon size={100}></DatabaseIcon>}
            newText={"New BDD Model"}
            sectionName={"BDD Model Lists"}
            content={ComponentList}
            elementView={ProjectListCard}
            newIcon={<Database size={50}></Database>}
        ></ListView>
    </div> 
}