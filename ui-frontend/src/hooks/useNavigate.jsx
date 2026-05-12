import { useDispatch } from "react-redux";
import { setActualWindow, setActualProject } from "../appSlice";

export const useNavigate = ()=>{
    const dispatch = useDispatch();

    const navigateTo = (windowName) => {
        dispatch(setActualWindow(windowName));
    };

    return navigateTo;
}

export const useNavigateProject = ()=>{
    const dispatch = useDispatch();

    const navigateToProject = (projectName) => {
        dispatch(setActualProject(projectName))
        dispatch(setActualWindow("Project Home Page"))
        console.log(projectName)
    };

    return navigateToProject
}