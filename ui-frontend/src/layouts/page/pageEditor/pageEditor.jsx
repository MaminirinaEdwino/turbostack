/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { GoApp } from "../../../services/bridge";
import {
  Save,
  FileText,
  Puzzle,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  PanelLeftOpen,
  CheckCircle,
  AlertCircle,
  PanelRightOpen,
  Smartphone,
  Tablet,
  Monitor,
  MonitorUp,
} from "lucide-react";
import VisualEditor from "./visualEditor";
import { FcPrevious } from "react-icons/fc";
import { useNavigate } from "../../../hooks/useNavigate";
import DarkModeToggle from "../../../components/darkModeToggle";
import ToDashBoardBtn from "./components/toDashBoardbtn";
import Header from "./components/header";
import PreviewSection from "./components/previewSection";
import Toast from "../../../components/toast";
import PageList from "./components/pageList";
import RightSideBar from "./components/rightSideBar";

export default function PageEditor({ projectName }) {
  const navigateTo = useNavigate();
  const [project, setProject] = useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState(null);
  const [editingType, setEditingType] = useState("page"); // 'page' ou 'component'
  const [loading, setLoading] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewport, setViewport] = useState({
    width: "1280px",
    height: "720px",
    name: "desktop",
  });
  const [zoomLevel, setZoomLevel] = useState(1); // New state for zoom
  const [toast, setToast] = useState(null);

  const [activeBlock, setActiveBlock] = useState(null);
  const [rightActiveTab, setRightActiveTab] = useState("properties");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // New zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.05, 2)); // Max zoom 200%
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.05, 0.5)); // Min zoom 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(1); // Reset to 100%
  };

  const siteData =
    project?.type === "static" ? project?.site_statique : project?.web_app;

  const compKey = siteData?.composants ? "composants" : "composant";
  const activeItem =
    editingType === "page"
      ? (selectedPageIndex != null)
        ? siteData?.pages[(selectedPageIndex != null && selectedPageIndex)]
        : null
      : selectedComponentIndex != null
        ? siteData?.[compKey]?.[selectedComponentIndex]
        : null;

  const previewHtml = useMemo(() => {
    if (!activeItem?.content || !Array.isArray(activeItem.content)) return ""; // Utilise activeItem
    const renderBlocks = (blocks) => {
      return blocks
        .map((b) => {
          const className = b.className || "";
          const styles = b.styles || "";
          const content = b.content || "";
          const href = b.href || "#";
          const htmlId = b.htmlId ? `id="${b.htmlId}"` : ""; // Ajout de l'attribut id si htmlId est défini
          const isJsonStyle =
            typeof styles === "string" && styles.trim().startsWith("{");
          const inlineStyleAttr = isJsonStyle ? "" : `style="${styles}"`;
          const childrenHtml = b.children ? renderBlocks(b.children) : "";
          if (b.tag === "img")
            return `<img src="${content}" class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId} />`;
          if (b.tag === "button")
            return `<button class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</button>`;
          if (b.tag === "a")
            return `<a href="${href}" class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</a>`;
          if (b.tag === "form")
            return `<form action="${b.action}" class="${className}" method="${b.method}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId}>${content}${childrenHtml}</form>`;
          if (b.tag == "input")
            return `<input type="${b.inputType}" placeholder="${b.placeholder}" class="${className}" data-block-id="${b.id}" ${htmlId} ${inlineStyleAttr} name="${b.name}" ${b.inputType == "radio" || b.inputType == "checkbox" && b.checked == true && "checked"} value="${b.value}" ${b.passwordViewToggler && `onclick="${b.targetedPassword}.type = this.checked ? 'text' : 'password' "`}/>`

          return `<${b.tag} class="${className}" ${inlineStyleAttr} data-block-id="${b.id}" ${htmlId} ${b.tag == "label" && `for="${b.for}"`}>${content}${childrenHtml}</${b.tag}>`;
        })
        .join("\n");
    };
    return renderBlocks(activeItem.content);
  }, [activeItem?.content]);

  // Génère le CSS spécifique aux blocs pour chaque viewport
  const blocksCss = useMemo(() => {
    if (!activeItem?.content) return "";
    let css = "";
    const process = (blocks) => {
      blocks.forEach((b) => {
        if (
          b.styles &&
          typeof b.styles === "string" &&
          b.styles.trim().startsWith("{")
        ) {
          try {
            const obj = JSON.parse(b.styles);
            const format = (s) =>
              Object.entries(s || {})
                .map(([p, v]) => `${p}: ${v};`)
                .join(" ");
            if (obj.desktop)
              css += `[data-block-id="${b.id}"] { ${format(obj.desktop)} }\n`;
            if (obj.tablet)
              css += `@media (max-width: 1024px) { [data-block-id="${b.id}"] { ${format(obj.tablet)} } }\n`;
            if (obj.mobile)
              css += `@media (max-width: 375px) { [data-block-id="${b.id}"] { ${format(obj.mobile)} } }\n`;
          } catch (e) {
            console.error(e);
          }
        }
        if (b.children) process(b.children);
      });
    };
    process(activeItem.content);
    return css;
  }, [activeItem?.content]);

  //mila modifiena am farany
  const globalCss = useMemo(() => {
    if (!activeItem?.styles) return ""; // Utilise activeItem
    try {
      const stylesObj = JSON.parse(activeItem.styles);
      const format = (s) =>
        Object.entries(s || {})
          .map(([tag, style]) => `${tag} { ${style} }`)
          .join("\n");
      if (stylesObj.desktop || stylesObj.tablet || stylesObj.mobile) {
        let css = format(stylesObj.mobile);
        if (stylesObj.tablet)
          css += `\n@media screen and (min-width: 768px) {\n${format(stylesObj.tablet)}\n}`;
        if (stylesObj.desktop)
          css += `\n@media screen and (min-width: 1024px) {\n${format(stylesObj.desktop)}\n}`;
        return css;
      }
      return format(stylesObj);
    } catch (e) {
      return `body { ${activeItem.styles} }`; // Utilise activeItem
    }
  }, [activeItem?.styles]);
  const channel = new BroadcastChannel('turbostack_preview_channel');

  // Envoie le code au preview à chaque changement


  useEffect(() => {
    const channel = new BroadcastChannel('turbostack_preview_channel');
    channel.onmessage = (event) => {
      if (event.data && event.data.type == "SET_VIEWPORT") {
        setViewport(event.data.viewport)
      }
      if (event.data && event.data.type == "PREVIEW_READY") {
        channel.postMessage({ type: 'UPDATE_RENDER', blockCss: blocksCss, globalCss: globalCss, previewHtml: previewHtml, viewport: viewport })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleDetachPreview = async () => {
    await GoApp.openPreviewWindow()
  };
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const res = await GoApp.fetchProjectByName(projectName);
      if (res) setProject(res);
      setLoading(false);
    };
    loadProject();
  }, [projectName]);

  // Mise à jour générique d'un champ de l'élément actif (page ou composant)
  const updateActiveItemField = (field, value) => {
    setProject((prev) => {
      if (!prev) return prev;
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";

      // Détection robuste de la clé des composants
      const actualCompKey = prev[typeKey]?.composants
        ? "composants"
        : "composant";
      const itemsKey = editingType === "page" ? "pages" : actualCompKey;

      const index =
        editingType === "page" ? selectedPageIndex : selectedComponentIndex;

      if (
        index === null ||
        !prev[typeKey] ||
        !prev[typeKey][itemsKey] ||
        !prev[typeKey][itemsKey][index]
      ) {
        console.warn("Update failed: invalid index or path", {
          itemsKey,
          index,
        });
        return prev;
      }

      const newItems = JSON.parse(JSON.stringify(prev[typeKey][itemsKey]));
      newItems[index] = { ...newItems[index], [field]: value };

      const updatedTypeData = { ...prev[typeKey], [itemsKey]: newItems };
      return { ...prev, [typeKey]: updatedTypeData };
    });
  };
  useEffect(() => {
    channel.postMessage({ type: 'UPDATE_RENDER', blocksCss: blocksCss, globalCss: globalCss, previewHtml: previewHtml, viewport: viewport });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksCss, globalCss, previewHtml, viewport, updateActiveItemField]);

  const addPage = () => {
    setProject((prev) => {
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      const newPage = {
        id: Math.random().toString(36).substr(2, 9),
        nom: "New Page",
        uri: "/new-page",
        content: [
          {
            id: Math.random().toString(36).substr(2, 9),
            tag: "div",
            content: "<h1>New Page</h1><p>Commencez à éditer...</p>",
            className: "p-8",
            styles: "",
          },
        ],
      };
      const updatedPages = [...(prev[typeKey].pages || []), newPage];
      return { ...prev, [typeKey]: { ...prev[typeKey], pages: updatedPages } };
    });
  };

  const removePage = (index) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;
    setProject((prev) => {
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      const updatedPages = prev[typeKey].pages.filter((_, i) => i !== index);
      return { ...prev, [typeKey]: { ...prev[typeKey], pages: updatedPages } };
    });
  };

  const addComponent = () => {
    setProject((prev) => {
      if (!prev) return prev;
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      // On utilise la clé déjà existante ou on en crée une par défaut selon le type
      const actualCompKey = prev[typeKey]?.composants
        ? "composants"
        : prev[typeKey]?.composant
          ? "composant"
          : prev.type === "static"
            ? "composants"
            : "composant";

      const newComponent = {
        id: Math.random().toString(36).substr(2, 9),
        nom: "New Component",
        content: [],
      };
      const updatedComponents = [
        ...(prev[typeKey][actualCompKey] || []),
        newComponent,
      ];
      return {
        ...prev,
        [typeKey]: { ...prev[typeKey], [actualCompKey]: updatedComponents },
      };
    });
  };

  const removeComponent = (index) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce composant ?"))
      return;
    setProject((prev) => {
      if (!prev) return prev;
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      const actualCompKey = prev[typeKey]?.composants
        ? "composants"
        : "composant";
      const updatedComponents = prev[typeKey][actualCompKey].filter(
        (_, i) => i !== index,
      );
      return {
        ...prev,
        [typeKey]: { ...prev[typeKey], [actualCompKey]: updatedComponents },
      };
    });
  };



  // Détection de la clé de composant pour l'affichage (priorité au pluriel comme dans pagelist.jsx)



  // Convertit les blocs JSON en HTML pour la prévisualisation dans l'iframe


  const handleSave = async () => {
    showToast("Saving project...", "loading");
    try {
      await GoApp.saveProject(projectName, JSON.stringify(project));
      showToast("Project saved successfully!");
    } catch (e) {
      console.error(e);
      showToast("Error saving project", "error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Sauvegarde
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      // Retour à la liste
      if (e.key === "Escape" && editMode) {
        setEditMode(false);
      }
      // Zoom
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
      // Barres latérales
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsLeftSidebarOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w") {
        e.preventDefault();
        setIsRightSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, project, zoomLevel]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
      {/* Header Commun */}
      <Header activeItem={activeItem} editMode={editMode} editingType={editingType} handleSave={handleSave} navigateTo={navigateTo} project={project} projectName={projectName} setEditMode={setEditMode} updateActiveItemField={updateActiveItemField} />
      <DarkModeToggle></DarkModeToggle>
      {/* Vue Conditionnelle */}
      <div className="flex-1 overflow-y-auto p-8">
        {editMode ? (
          <div className="flex h-full min-h-150 ">
            {/* Left Sidebar: Structure & Blocks */}
            <aside
              className={`fixed top-2 h-full z-50 transition-transform duration-300 ease-in-out ${isLeftSidebarOpen ? "left-0" : "-left-100"} w-80 bg-couleur3 dark:bg-gray-950 border-r border-couleur1/10 shadow-xl flex flex-col p-6 overflow-y-auto my-2 `}
            >
              <div className="flex justify-between items-center mb-6 sticky -top-6 bg-couleur3 z-10">
                <h2 className="text-sm font-black uppercase text-couleur1/80">
                  Structure
                </h2>
                <button
                  onClick={() => setIsLeftSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-couleur1/10 text-couleur1 dark:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <VisualEditor
                key={`left-${editingType}-${editingType === "page" ? selectedPageIndex : selectedComponentIndex}`}
                content={activeItem?.content}
                availablePages={siteData?.pages || []}
                availableComponents={siteData?.[compKey] || []}
                activeBlock={activeBlock}
                setActiveBlock={setActiveBlock}
                activeTab="blocks"
                activeViewport={viewport.name}
                allowedTabs={["blocks"]}
                onChange={(blocks) => updateActiveItemField("content", blocks)}
                showToast={showToast}
                onPageStylesChange={(styles) =>
                  updateActiveItemField("styles", styles)
                }

                editingtype={editingType}
                updateBlockStyle={updateActiveItemField}
                activePage={activeItem}
              />
            </aside>

            {/* Main content: Prévisualisation isolée (Iframe) */}
            <PreviewSection
              blocksCss={blocksCss}
              globalCss={globalCss}
              handleDetachPreview={handleDetachPreview}
              handleResetZoom={handleResetZoom}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              isLeftSidebarOpen={isLeftSidebarOpen}
              isRightSidebarOpen={isRightSidebarOpen}
              setIsLeftSidebarOpen={setIsLeftSidebarOpen}
              setIsRightSidebarOpen={setIsRightSidebarOpen}
              previewHtml={previewHtml}
              setViewport={setViewport}
              zoomLevel={zoomLevel}
              viewport={viewport}
            />


            {/* Right Sidebar: Properties & Global */}
            <RightSideBar
              activeBlock={activeBlock}
              activeItem={activeItem}
              compKey={compKey}
              editingType={editingType}
              isRightSidebarOpen={isRightSidebarOpen}
              rightActiveTab={rightActiveTab}
              selectedComponentIndex={selectedComponentIndex}
              selectedPageIndex={selectedPageIndex}
              setActiveBlock={setActiveBlock}
              setIsRightSidebarOpen={setIsRightSidebarOpen}
              setRightActiveTab={setRightActiveTab}
              showToast={showToast}
              siteData={siteData}
              updateActiveItemField={updateActiveItemField}
              viewport={viewport}
            />
          </div>
        ) : (
          <PageList addComponent={addComponent} addPage={addPage} compKey={compKey} project={project} removeComponent={removeComponent} removePage={removePage} setEditMode={setEditMode} setEditingType={setEditingType} setSelectedComponentIndex={setSelectedComponentIndex} setSelectedPageIndex={setSelectedPageIndex} siteData={siteData} />
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast toast={toast} />
      )}
    </div>
  );
}
