export default function LayoutHeader({ layoutName }) {
    return <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-couleur1" >{layoutName}</h1>
    </header>
}