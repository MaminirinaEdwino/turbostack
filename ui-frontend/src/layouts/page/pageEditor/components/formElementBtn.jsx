export default function FormElementBtn({ content, action }) {
    return <button className='flex items-center gap-2 p-3 px-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-couleur1/10 hover:border-couleur1 transition-all text-couleur1 text-sm'
        onClick={() => action()}
    > {content} </button>
}