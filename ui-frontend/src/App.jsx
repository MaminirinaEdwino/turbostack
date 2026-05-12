
import './App.css'
import { GoApp } from './services/bridge'
import { useSelector } from 'react-redux'
import HomePage from './layouts/homepage/homePage';
import ProjectList from './layouts/projects/projectList';


// Composants factices pour la démonstration du routage
const Home = () => <div className=' stroke-pink-700'><h1>Page d'Accueil</h1><p>Bienvenue sur l'application Turbo Stack!</p></div>;
const About = () => <div><h1>À Propos</h1><p>Informations sur l'application.</p></div>;
const Settings = () => <div><h1 className='bg-red'>Paramètres</h1><p>Configurez vos préférences ici.</p></div>;
const Projects = () => <div><h1>Mes Projets</h1><p>Gérez vos projets df ici.</p></div>;

function App() {
  // Récupérer l'état actuel de la fenêtre depuis le store Redux
  const actualWindow = useSelector((state) => state.app.actualWindow);
  // Obtenir la fonction dispatch pour envoyer des actions
  

  // Rendu conditionnel basé sur la valeur de actualWindow
  const renderContent = () => {
    switch (actualWindow) {
      case 'Dashboard': return <HomePage />;
      case 'Project': return <ProjectList />;
      case 'settings': return <Settings />;
      case 'projects': return <Projects />;
      default: return <Home />; // Fallback
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
