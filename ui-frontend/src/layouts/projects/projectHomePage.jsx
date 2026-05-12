import MainContainer from '../mainContainer';
import MainLayout from '../mainLayout';

export default function ProjectHomePage({projectName}){
    return <MainLayout child={
        <MainContainer child={<> {projectName}</>} layoutName={"Project "+projectName}></MainContainer>
    }></MainLayout>
}