import { useEffect, useState } from 'react';
import MainContainer from '../mainContainer';
import MainLayout from '../mainLayout';
import { GoApp } from '../../services/bridge';
import ProjectPageView from './projectPageContent';

export default function ProjectHomePage({ projectName }) {
    const [loading, setLoading] = useState(true)
    const [project, setProject] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const res = await GoApp.fetchProjectByName(`${projectName}`)
            setProject(res)
            setLoading(false)
        }
        fetchData()
    }, [projectName])
    return <MainLayout child={
        <MainContainer
            child={!loading && <ProjectPageView project={project}></ProjectPageView>}
            layoutName={"Project " + projectName}></MainContainer>
    }></MainLayout>
}