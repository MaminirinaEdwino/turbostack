
import './App.css'
import { GoApp } from './services/bridge'
import { useSelector } from 'react-redux'
import HomePage from './layouts/homepage/homePage';
import ProjectList from './layouts/projects/projectList';
import ComponentsList from './layouts/componantList/componantList';
import Assetslist from './layouts/assets/assetsLists';
import APIlist from './layouts/api/apiList';
import Pageslist from './layouts/page/pagelist';
import BDDModelList from './layouts/models/modelList';
import Subscription from './pages/subscription';

function App() {
  const actualWindow = useSelector((state) => state.app.actualWindow);

  const renderContent = () => {
    switch (actualWindow) {
      case 'Dashboard': return <HomePage />;
      case 'Project': return <ProjectList />;
      case 'Components': return <ComponentsList />;
      case 'Assets': return <Assetslist />;
      case 'Api': return <APIlist />;
      case 'Pages': return <Pageslist />;
      case 'Models': return <BDDModelList />;
      case 'Subscription': return <Subscription/>;
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
