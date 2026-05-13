import ProjectResume from "./components/projectResume";

export default function ProjectPageView({project}){
    return <>
    <ProjectResume nom={project.nom} type={project.type} description={project.description}></ProjectResume>
    {Object.keys(project.bdd).length > 0 && "bdd"} 
    {Object.keys(project.rest_api).length > 0  && "api"} 
    {Object.keys(project.web_app).length > 0&& "web_app"} 
    {Object.keys(project.site_statique).length > 0 && "static_site"}
    </>
}