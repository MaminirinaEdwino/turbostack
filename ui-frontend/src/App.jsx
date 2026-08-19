import "./App.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HomePage from "./layouts/homepage/homePage";
import ProjectList from "./layouts/projects/projectList";
import ComponentsList from "./layouts/componantList/componantList";
import Assetslist from "./layouts/assets/assetsLists";
import APIlist from "./layouts/api/apiList";
import Pageslist from "./layouts/page/pagelist";
import BDDModelList from "./layouts/models/modelList";
import Subscription from "./pages/subscription";
import NewProject from "./layouts/projects/newProject";
import ProjectHomePage from "./layouts/projects/exportPage";
import DbEditor from "./layouts/projects/databaseEditor/dbEditor";
import ApiEditor from "./layouts/projects/endPointEditor/apiEditor";
import PageEditor from "./layouts/page/pageEditor/pageEditor";
import ControllerEditor from "./components/controllerEditor";
import logo from "./assets/logotransparent.png";
import FileExplorer from "./layouts/projects/fileExplorer";
import UnifiedEditor from "./layouts/projects/unifiedEditor";
import HelpDocumentation from "./helpComponent";
import { GoApp } from "./services/bridge";
import WorkspaceNavigationBar from "./components/workspaceNavigation";
function App() {
  const actualWindow = useSelector((state) => state.app.actualWindow);
  const actualProject = useSelector((state) => state.app.actualProject);
  const isDarkMode = useSelector((state) => state.app.darkMode);
  const [isAppReady, setIsAppReady] = useState(false);
  const windowList = [
    "api_editor",
    "page_editor",
    "db_editor",
    "Files",
    "Export"
  ]
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  useEffect(() => {
    const loadLibrairie = async () => {
      const res = await GoApp.loadLibrairie()
      console.log(res)
    }
    loadLibrairie()
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (actualWindow) {
      case "Dashboard":
        return <HomePage />;
      case "Project":
        return <ProjectList />;
      case "Components":
        return <ComponentsList />;
      case "Assets":
        return <Assetslist />;
      case "Api":
        return <APIlist />;
      case "Static Site":
        return <Pageslist />;
      case "Web App":
        return <Pageslist />;
      case "Models":
        return <BDDModelList />;
      case "Subscription":
        return <Subscription />;
      case "New Project":
        return <NewProject />;
      case "Export":
        return <ProjectHomePage projectName={actualProject}></ProjectHomePage>;
      case "db_editor":
        return <DbEditor projectName={actualProject}></DbEditor>;
      case "api_editor":
        return <ApiEditor projectName={actualProject}></ApiEditor>;
      case "page_editor":
        return <PageEditor projectName={actualProject}></PageEditor>;
      case "controller_editor":
        return (
          <ControllerEditor projectName={actualProject}></ControllerEditor>
        );
      case "Files":
        return <FileExplorer projectName={actualProject}></FileExplorer>;
      case "unified_editor":
        return <UnifiedEditor projectName={actualProject}></UnifiedEditor>;
      default:
        return <HomePage />; // Fallback
    }
  };
  const [isDocOpen, setIsDocOpen] = useState(false);
  if (!isAppReady) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-couleur3 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="" />
          <h1 className="text-xl font-black text-couleur1 tracking-[0.2em] uppercase animate-pulse">
            TurboStack
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsDocOpen(true)}
        className="px-4 z-50 py-2 bg-couleur1 text-white rounded-lg fixed right-2 bottom-35"
      >
        ?
      </button>

      {/* Le composant Documentation qui s'affiche par-dessus l'interface */}
      <HelpDocumentation
        isOpen={isDocOpen}
        onClose={() => setIsDocOpen(false)}
      />
      {
        windowList.includes(actualWindow) && <WorkspaceNavigationBar />
      }
      <main className="transition-colors duration-300">{renderContent()}</main>
    </>
  );
}

export default App;
