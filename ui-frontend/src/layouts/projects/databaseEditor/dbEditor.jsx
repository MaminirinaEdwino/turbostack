import { useNavigateProject } from "../../../hooks/useNavigate"

export default function DbEditor({projectName}){
    const navigateTo = useNavigateProject()
    return <>
    DB Editor <button onClick={()=>navigateTo(projectName)}>{projectName}</button>
    </>
}