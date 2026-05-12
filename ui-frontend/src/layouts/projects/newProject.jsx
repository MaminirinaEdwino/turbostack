import LayoutHeader from "../../components/layoutHeader";
import MainLayout from "../mainLayout";

export default function NewProject() {
    return <MainLayout child={
        <div className="flex-1 p-8 overflow-y-auto">
            <LayoutHeader layoutName={"New Project"}></LayoutHeader>
        </div>
    }></MainLayout>
}