import { useDispatch } from "react-redux";
import { setActualWindow } from "../appSlice";

export const useNavigate = ()=>{
    const dispatch = useDispatch();

    const navigateTo = (windowName) => {
        dispatch(setActualWindow(windowName));
    };

    return navigateTo;
}