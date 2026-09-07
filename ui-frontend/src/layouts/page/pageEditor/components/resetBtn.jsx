import { LoaderCircle } from "lucide-react";

export default function ResetBtn({ ctrl, handleStyleChange }) {
    return <span className="text-[9px] font-bold opacity-40 uppercase">{ctrl.label} {ctrl.reset && <>
        <button onClick={() => handleStyleChange(ctrl.prop, ctrl.reset)}><LoaderCircle size={10} /></button>
    </>}
    </span>
}