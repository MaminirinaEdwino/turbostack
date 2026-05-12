
import './App.css'
import { GoApp } from './services/bridge'
import { useSelector } from 'react-redux'
import HomePage from './layouts/homepage/homePage';
import ProjectList from './layouts/projects/projectList';
import ComponentsList from './layouts/componantList/componantList';
import Assetslist from './layouts/assets/assetsLists';

function App() {
  const actualWindow = useSelector((state) => state.app.actualWindow);
  
  const renderContent = () => {
    switch (actualWindow) {
      case 'Dashboard': return <HomePage />;
      case 'Project': return <ProjectList />;
      case 'Components': return <ComponentsList />;
      case 'Assets': return <Assetslist />;
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
