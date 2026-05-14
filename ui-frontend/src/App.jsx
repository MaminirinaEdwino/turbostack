
import './App.css'
import { useSelector } from 'react-redux'
import HomePage from './layouts/homepage/homePage';
import ProjectList from './layouts/projects/projectList';
import ComponentsList from './layouts/componantList/componantList';
import Assetslist from './layouts/assets/assetsLists';
import APIlist from './layouts/api/apiList';
import Pageslist from './layouts/page/pagelist';
import BDDModelList from './layouts/models/modelList';
import Subscription from './pages/subscription';
import NewProject from './layouts/projects/newProject';
import ProjectHomePage from './layouts/projects/projectHomePage';
import DbEditor from './layouts/projects/databaseEditor/dbEditor';

function App() {
  const actualWindow = useSelector((state) => state.app.actualWindow);
  const actualProject = useSelector((state) => state.app.actualProject);

  const renderContent = () => {
    switch (actualWindow) {
      case 'Dashboard': return <HomePage />;
      case 'Project': return <ProjectList />;
      case 'Components': return <ComponentsList />;
      case 'Assets': return <Assetslist />;
      case 'Api': return <APIlist />;
      case 'Static sites': return <Pageslist />;
      case 'Web App': return <Pageslist />;
      case 'Models': return <BDDModelList />;
      case 'Subscription': return <Subscription/>;
      case 'New Project': return <NewProject/>
      case 'Project Home Page': return <ProjectHomePage projectName={actualProject}></ProjectHomePage>
      case 'db_editor': return <DbEditor projectName={actualProject}></DbEditor>
      default: return <HomePage />; // Fallback
    }
  };

  return (
    <>
      <main>
        {renderContent()}
      </main>
    </>
  )
}

export default App
