import { CheckCircle } from "lucide-react";

export default function Toast({toast}) {
    return <div className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
            toast.type === "loading" ? "bg-blue-50 border-blue-200 text-blue-700" :
                "bg-green-50 border-green-200 text-green-700"
        }`}>
        {toast.type === "loading" ? <Loader2 size={18} className="animate-spin" /> :
            toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
        <span className="font-medium text-sm">{toast.message}</span>
    </div>
}