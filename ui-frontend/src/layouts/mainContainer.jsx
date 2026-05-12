import LayoutHeader from "../components/layoutHeader";

export default function MainContainer({ child, layoutName }) {
    return <div className="flex-1 p-8 overflow-y-auto">
        <LayoutHeader layoutName={layoutName}></LayoutHeader>
        {child} df
    </div>
}