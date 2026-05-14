export const GoApp = {
    sayHello: async (name) => {
        // console.log("hello")
        console.log( await window.sayHello(name));
    },
    getStats: async () => {
        if (window.GetStats) {
            return await window.getStats();
        }
        return { os: "Browser", arch: "wasm" };
    },
    createProject: async (name, description, type)=>{
        return await window.createProject(name, description, type);
    },
    fetchProjects: async ()=>{
        return await window.fetchProjects();
    },
    fetchProjectByName: async (name)=>{
        return await window.fetchByProjectName(name)
    },
    savedb: async (name, project)=>{
        return await window.saveBdd(name, project)
    } 
}