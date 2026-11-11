/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GoApp } from "../../../services/bridge";
import { useNavigate } from "../../../hooks/useNavigate";
import DarkModeToggle from "../../../components/darkModeToggle";
import ToDashBoardBtn from "./components/toDashBoardbtn";
import Header from "./components/header";
import PreviewSection from "./components/previewSection";
import Toast from "../../../components/toast";
import PageList from "./components/pageList";
import RightSideBar from "./components/rightSideBar";
import LeftSideBar from "./components/leftSideBar";
import { Loader2 } from "lucide-react";

export default function PageEditor({ projectName }) {
  const [subscription, setSubscription] = useState(null)
  const navigateTo = useNavigate();

  // États d'historique pour Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [project, setProjectState] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };
  // Fonction personnalisée pour mettre à jour le projet en enregistrant l'historique
  const setProject = useCallback((updater, overwrite = false) => {
    setProjectState((prev) => {
      const nextProject = typeof updater === "function" ? updater(prev) : updater;
      if (JSON.stringify(prev) === JSON.stringify(nextProject)) return prev;

      setHistory((currHistory) => {
        const newHistory = currHistory.slice(0, historyIndex + 1);
        // Limiter l'historique à 30 états maximum pour éviter les surcharges mémoire
        if (newHistory.length >= 30) newHistory.shift();
        return [...newHistory, nextProject];
      });
      setHistoryIndex((currIndex) => Math.min(currIndex + 1, 29));
      return nextProject;
    });
  }, [historyIndex]);

  // Fonction Undo (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setProjectState(history[newIndex]);
      showToast("Undo", "info");
    }
  }, [historyIndex, history]);

  // Fonction Redo (Ctrl+Y / Ctrl+Shift+Z)
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setProjectState(history[newIndex]);
      showToast("Redo", "info");
    }
  }, [historyIndex, history]);

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
  const [zoomLevel, setZoomLevel] = useState(1);


  const [activeBlock, setActiveBlock] = useState(null);
  const [rightActiveTab, setRightActiveTab] = useState("properties");



  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.05, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.05, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const siteData =
    project?.type === "static" ? project?.site_statique : project?.web_app;

  const compKey = siteData?.composants ? "composants" : "composants";
  const activeItem =
    editingType === "page"
      ? (selectedPageIndex != null)
        ? siteData?.pages[(selectedPageIndex != null && selectedPageIndex)]
        : null
      : selectedComponentIndex != null
        ? siteData?.[compKey]?.[selectedComponentIndex]
        : null;

  const previewHtml = useMemo(() => {
    if (!activeItem?.content || !Array.isArray(activeItem.content)) return "";
    const renderBlocks = (blocks) => {
      return blocks
        .map((b) => {
          const className = b.className || "";
          const styles = b.styles || "";
          const content = b.content || "";
          const href = b.href || "#";
          const htmlId = b.htmlId ? `id="${b.htmlId}"` : "";
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

  const globalCss = useMemo(() => {
    if (!activeItem?.styles) return "";
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
      return `body { ${activeItem.styles} }`;
    }
  }, [activeItem?.styles]);

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
  }, [blocksCss, globalCss, previewHtml, viewport])

  const handleDetachPreview = async () => {
    await GoApp.openPreviewWindow()
  };

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const res = await GoApp.fetchProjectByName(projectName);
      if (res) {
        setProjectState(res);
        setHistory([res]);
        setHistoryIndex(0);
      }
      setLoading(false);
    };
    loadProject();
  }, [projectName]);

  const updateActiveItemField = useCallback((field, value) => {
    setProject((prev) => {
      if (!prev) return prev;
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      const actualCompKey = prev[typeKey]?.composants ? "composants" : "composants";
      const itemsKey = editingType === "page" ? "pages" : actualCompKey;
      const index = editingType === "page" ? selectedPageIndex : selectedComponentIndex;

      if (
        index === null ||
        !prev[typeKey] ||
        !prev[typeKey][itemsKey] ||
        !prev[typeKey][itemsKey][index]
      ) {
        return prev;
      }

      const newItems = JSON.parse(JSON.stringify(prev[typeKey][itemsKey]));
      newItems[index] = { ...newItems[index], [field]: value };

      const updatedTypeData = { ...prev[typeKey], [itemsKey]: newItems };
      return { ...prev, [typeKey]: updatedTypeData };
    });
  }, [editingType, selectedComponentIndex, selectedPageIndex, setProject]);

  useEffect(() => {
    const channel = new BroadcastChannel('turbostack_preview_channel');
    channel.postMessage({ type: 'UPDATE_RENDER', blocksCss: blocksCss, globalCss: globalCss, previewHtml: previewHtml, viewport: viewport });
  }, [blocksCss, globalCss, previewHtml, viewport]);

  useEffect(() => {
    const checkToken = async () => {
      const res = await GoApp.checkToken()
      setSubscription(res)
    }
    checkToken()
  }, [])

  const addPage = () => {
    const createPage = () => {
      setProject((prev) => {
        const typeKey = prev.type === "static" ? "site_statique" : "web_app";
        const newPage = {
          id: Math.random().toString(36).substr(2, 9),
          nom: "New Page " + (prev?.site_statique?.pages?.length || 0),
          uri: "/new-page-" + (prev?.site_statique?.pages?.length || 0),
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
    }
    // alert(project.site_statique)
    if (!subscription || subscription.subscription == "free" || subscription.subscription == null) {
      // alert(project.site_statique?.pages)
      if ((project.site_statique?.pages != null && project.site_statique?.pages.length < 5) || project.site_statique.pages == null) {
        createPage()
      }
    } if (subscription.subscription == "pro") {
      createPage()
    } else {
      showToast("Activate TurboStack to add more pages", "error")
    }
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
      const actualCompKey = prev[typeKey]?.composants ? "composants" : "composants";

      const newComponent = {
        id: Math.random().toString(36).substr(2, 9),
        nom: "New Component " + (prev[typeKey][actualCompKey]?.length || 0),
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
    if (!window.confirm("Voulez-vous vraiment supprimer ce composant ?")) return;
    setProject((prev) => {
      if (!prev) return prev;
      const typeKey = prev.type === "static" ? "site_statique" : "web_app";
      const actualCompKey = prev[typeKey]?.composants ? "composants" : "composants";
      const updatedComponents = prev[typeKey][actualCompKey].filter(
        (_, i) => i !== index,
      );
      return {
        ...prev,
        [typeKey]: { ...prev[typeKey], [actualCompKey]: updatedComponents },
      };
    });
  };

  const handleSave = async () => {
    showToast("Saving project...", "loading");
    try {
      await GoApp.saveProject(projectName, JSON.stringify(project));
      console.log(project.site_statique.composants)
      showToast("Project saved successfully!");
    } catch (e) {
      console.error(e);
      showToast("Error saving project", "error");
    }
  };

  // Gestionnaire des raccourcis clavier globaux (Ctrl+Z, Ctrl+Y, Sauvegarde, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z (sans la touche Shift)
      if (isCtrlOrMeta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y ou Ctrl+Shift+Z
      else if ((isCtrlOrMeta && e.key.toLowerCase() === "y") || (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        handleRedo();
      }
      // Sauvegarde: Ctrl+S
      else if (isCtrlOrMeta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      // Retour à la liste: Escape
      else if (e.key === "Escape" && editMode) {
        setEditMode(false);
      }
      // Zoom In: Ctrl +
      else if (isCtrlOrMeta && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        handleZoomIn();
      }
      // Zoom Out: Ctrl -
      else if (isCtrlOrMeta && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      // Reset Zoom: Ctrl 0
      else if (isCtrlOrMeta && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
      // Toggle Left Sidebar: Ctrl+W
      else if (isCtrlOrMeta && e.key.toLowerCase() === "w") {
        e.preventDefault();
        setIsLeftSidebarOpen((prev) => !prev);
      }
      // Toggle Right Sidebar: Ctrl+B
      else if (isCtrlOrMeta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsRightSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editMode, handleUndo, handleRedo]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-gray-950">
      <Header
        activeItem={activeItem}
        editMode={editMode}
        editingType={editingType}
        handleSave={handleSave}
        navigateTo={navigateTo}
        project={project}
        projectName={projectName}
        setEditMode={setEditMode}
        updateActiveItemField={updateActiveItemField}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <div className="flex-1 overflow-y-auto p-8">
        {editMode ? (
          <div className="flex h-full min-h-150 ">
            <LeftSideBar
              activeBlock={activeBlock}
              activeItem={activeItem}
              compKey={compKey}
              editingType={editingType}
              isLeftSidebarOpen={isLeftSidebarOpen}
              selectedComponentIndex={selectedComponentIndex}
              selectedPageIndex={selectedPageIndex}
              setActiveBlock={setActiveBlock}
              setIsLeftSidebarOpen={setIsLeftSidebarOpen}
              showToast={showToast}
              siteData={siteData}
              updateActiveItemField={updateActiveItemField}
              viewport={viewport}
            />

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

      {toast && (
        <Toast toast={toast} />
      )}
    </div>
  );
}