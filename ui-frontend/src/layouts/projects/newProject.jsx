import LayoutHeader from "../../components/layoutHeader";
import MainLayout from "../mainLayout";
import newProjetIllustration from "../../assets/newProject.svg";
import { useNavigate } from "../../hooks/useNavigate";
import { useState } from "react";
import { GoApp } from "../../services/bridge";
import { Plus, X, FolderPlus } from "lucide-react";
export default function NewProject() {
    const navigateTo = useNavigate();
    const [newProjectValue, setNewProject] = useState({
        name: "",
        description: "",
        type: ""
    })
    const handleCreateProject = async (e) => {
        e.preventDefault()
        
        // Appel au backend Go via le bridge
        if(await GoApp.createProject(newProjectValue.name, newProjectValue.description, newProjectValue.type) == "Project already exists"){
            alert("Project already exists")
            return
        }
        
        // setNewProject({
        //     name: "",
        //     description: "",
        //     type: ""
        // })
        // Redirection vers la liste des projets après création
        
        navigateTo("Project")
    }
    return <MainLayout child={
        <div className="flex-1 p-8 overflow-y-auto">
            <LayoutHeader layoutName={"New Project"}></LayoutHeader>
            <div className="flex flex-col md:flex-row items-center gap-12 mt-10">
                <div className="hidden md:block w-1/2">
                    <img className="w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500" src={newProjetIllustration} alt="New Project Illustration" />
                </div>
                <form className="bg-white p-8 rounded-2xl border border-couleur1/10 shadow-xl w-full md:w-1/2 max-w-lg flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-couleur1 opacity-50 uppercase tracking-wider" htmlFor="newProjectName">Project Name</label>
                        <input 
                            className="border border-couleur1/20 p-3 rounded-xl bg-couleur3/10 outline-none focus:ring-2 ring-couleur1/20 text-couleur1 transition-all" 
                            type="text" id="newProjectName" name="newName" placeholder="My Awesome Project"
                            onInput={(e) => setNewProject(newProjectValue => ({ ...newProjectValue, name: e.target.value }))} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-couleur1 opacity-50 uppercase tracking-wider" htmlFor="newProjectDescription">Description</label>
                        <textarea 
                            className="border border-couleur1/20 p-3 rounded-xl bg-couleur3/10 outline-none focus:ring-2 ring-couleur1/20 text-couleur1 transition-all h-32 resize-none" 
                            name="" id="newProjectDescription" placeholder="What is this project about?"
                            onInput={(e) => setNewProject(newProjectValue => ({ ...newProjectValue, description: e.target.value }))}
                        ></textarea>
                    </div >
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-couleur1 opacity-50 uppercase tracking-wider" htmlFor="newProjectType">Project Type</label>
                        <select className="border border-couleur1/20 p-3 rounded-xl bg-couleur3/10 outline-none focus:ring-2 ring-couleur1/20 text-couleur1 transition-all appearance-none cursor-pointer" name="newProjectType" id="newProjectType" onInput={ (e)=>setNewProject(newProjectValue => ({ ...newProjectValue, type: e.target.value }))}>
                            <option value="">Choose the project type</option>
                            <option value="api">API</option>
                            <option value="bdd">Database Model</option>
                            <option value="static">Static website</option>
                            <option value="webapp">Webapp</option>
                        </select>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button onClick={handleCreateProject} className="flex-1 flex items-center justify-center gap-2 bg-couleur1 text-white py-3 rounded-xl hover:shadow-lg hover:bg-opacity-90 transition-all font-bold">
                            <FolderPlus size={20} /> Create Project
                        </button>
                        <button type="button" onClick={() => navigateTo("Project")} className="px-6 py-3 rounded-xl border border-couleur1 text-couleur1 font-bold hover:bg-couleur3 transition-all flex items-center gap-2">
                            <X size={20} /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }></MainLayout>
}