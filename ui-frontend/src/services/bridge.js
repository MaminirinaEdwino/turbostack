import { WindIcon } from "lucide-react";

export const GoApp = {
    sayHello: async (name) => {
        // console.log("hello")
        console.log(await window.sayHello(name));
    },
    getStats: async () => {
        if (window.GetStats) {
            return await window.getStats();
        }
        return { os: "Browser", arch: "wasm" };
    },
    createProject: async (name, description, type) => {
        return await window.createProject(name, description, type);
    },
    fetchProjects: async () => {
        return await window.fetchProjects();
    },
    fetchProjectByName: async (name) => {
        return await window.fetchByProjectName(name)
    },
    savedb: async (name, project) => {
        return await window.saveBdd(name, project)
    },
    saveProject: async (name, project) => {
        return await window.saveProject(name, project)
    },
    exportProject: async (name, type) => {
        return await window.exportProject(name, type)
    },
    fetchProjectFiles: async (name) => {
        return await window.fetchProjectFiles(name)
    },
    getFileContent: async (name, path) => {
        return await window.getFileContent(name, path)
    },
    saveToken: async (token) => {
        return await window.saveToken(token)
    },
    checkToken: async () => {
        return await window.checkToken()
    },
    fetChFileForUpload: async (folder) => {
        return await window.getFolderForUpload(folder)
    },
    getImageAsBase64: async (path) => {
        return await window.getImageAsBase64(path)
    },
    uploadAsset: async (projectName, fileName, base64file) => {
        return await window.uploadAsset(projectName, fileName, base64file)
    },
    saveScript: async (projectName, scriptName, script) => {
        return await window.saveScript(projectName, scriptName, script)
    },
    runProject: async (projectName) => {
        return await window.startProject(projectName)
    },
    stopProject: async (projectName) => {
        return await window.stopProject(projectName)
    },
    getStatus: async () => {
        return await window.getStatus()
    },
    openPreviewWindow: async () => {
        return await window.openPreviewWindow()
    },
    loadLibrairie: async ()=>{
        return await window.loadLibrairie()
    },
    loadPageLibrairie: async ()=>{
        return await window.loadPageLibrairie()
    },
    loadCompLib: async ()=>{
        return await window.loadCompLib()
    },
    loadStyleLib: async ()=>{
        return await window.loadStyleLib()
    }
}