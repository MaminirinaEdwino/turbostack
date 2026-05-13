import BDDProjectInterface from "./components/bddPageInterface";
import ProjectResume from "./components/projectResume";

export default function ProjectPageView({project}){
    return <div className="m-2">
    <ProjectResume nom={project.nom} type={project.type} description={project.description}></ProjectResume>
    {project.type == "bdd" && <BDDProjectInterface project={project}></BDDProjectInterface>}
    </div>
}