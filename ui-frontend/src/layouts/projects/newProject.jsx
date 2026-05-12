import LayoutHeader from "../../components/layoutHeader";
import MainLayout from "../mainLayout";
import newProjetIllustration from "../../assets/newProject.svg";
import { useNavigate } from "../../hooks/useNavigate";
import { useState } from "react";
export default function NewProject() {
    const navigateTo = useNavigate();
    const [newProjectValue, setNewProject] = useState({
        name: "",
        description: "",
        type: ""
    })
    const handleCreateProject = (e) => {
        e.preventDefault()
        setNewProject({
            name: "",
            description: "",
            type: ""
        })
        console.log(newProjectValue)
    }
    return <MainLayout child={
        <div className="flex-1 p-8 overflow-y-auto">
            <LayoutHeader layoutName={"New Project"}></LayoutHeader>
            <div className="flex">
                <img className="hidden md:block w-1/2" src={newProjetIllustration} alt="" />
                <form className="newProjectForm">
                    <div >
                        <label htmlFor="newProjectName" >Project Name</label>
                        <input className="" type="text" id="newProjectName" name="newName" onInput={(e) => setNewProject(newProjectValue => ({ ...newProjectValue, name: e.target.value }))} />
                    </div>
                    <div >
                        <label htmlFor="newProjectDescription">Description</label>
                        <textarea name="" id="newProjectDescription" onInput={(e) => setNewProject(newProjectValue => ({ ...newProjectValue, description: e.target.value }))}></textarea>
                    </div >
                    <div >
                        <label htmlFor="newProjectType">Project Type</label>
                        <select name="newProjectType" id="newProjectType" onInput={ (e)=>setNewProject(newProjectValue => ({ ...newProjectValue, type: e.target.value }))}>
                            <option value="">Choose the project type</option>
                            <option value="api">API</option>
                            <option value="bdd">Database Model</option>
                            <option value="static">Static website</option>
                            <option value="webapp">Webapp</option>
                        </select>
                    </div>
                    <main >
                        <button onClick={handleCreateProject}>Create</button>
                        <button onClick={() => navigateTo("Project")}>Cancel</button>
                    </main>
                </form>
            </div>
        </div>
    }></MainLayout>
}