import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function ExportNotification({status}) {
    return <>
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${status.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' :
                status.type === 'loading' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-green-50 border-green-100 text-green-700'
            }`}>
            {status.type === 'loading' ? <Loader2 size={20} className="animate-spin" /> : status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-bold text-sm">{status.message}</span>
        </div>
    </>
}