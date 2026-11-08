import { useTranslation } from "../../../i18n";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "../../../hooks/useNavigate";
import { useCheckToken } from "../../../hooks/useCheckToken";
import { GoApp } from "../../../services/bridge";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DbModel from "./dbModel";
import NewModel from "./newModel";
import EditModel from "./editModel";
import GenerateUserTable from "./generateUserTable";
import { FcPrevious } from "react-icons/fc";
import {
  Plus,
  Save,
  CheckCircle,
  Loader2,
  AlertCircle,
  LayoutGrid,
  User,
  MoreVertical,
  Code2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import DarkModeToggle from "../../../components/darkModeToggle";
import QueryBuilder from "./queryBuilder";

const initialNodes = [];
const nodeType = { model: DbModel };
const initialEdges = [];

export default function DbEditor({ projectName }) {
  const { t } = useTranslation();
  const navigateTo = useNavigate();

  // États d'historique pour Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [project, setProjectState] = useState(null);

  // Fonction personnalisée pour mettre à jour le projet en enregistrant l'historique
  const setProject = useCallback((updater) => {
    setProjectState((prev) => {
      const nextProject = typeof updater === "function" ? updater(prev) : updater;
      if (JSON.stringify(prev) === JSON.stringify(nextProject)) return prev;

      setHistory((currHistory) => {
        const newHistory = currHistory.slice(0, historyIndex + 1);
        if (newHistory.length >= 30) newHistory.shift();
        return [...newHistory, nextProject];
      });
      setHistoryIndex((currIndex) => Math.min(currIndex + 1, 29));
      return nextProject;
    });
  }, [historyIndex]);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };
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

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [toggleModal, setToggleModal] = useState("none");
  const [toggleEditModal, setToggleEditModal] = useState("none");
  const [toggleUserModal, setToggleUserModal] = useState("none");
  const [selectedModelIndex, setSelectedModelIndex] = useState(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const subscription = useCheckToken();

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  useEffect(() => {
    const loadProject = async () => {
      const res = await GoApp.fetchProjectByName(projectName);
      if (res && res.bdd) {
        setProjectState(res.bdd);
        setHistory([res.bdd]);
        setHistoryIndex(0);
      }
    };
    if (project == null) {
      loadProject();
    }
  }, [projectName, project]);

  const deleteModel = useCallback((name) => {
    const nodeId = "model-" + name;
    setProject((prev) => ({
      ...prev,
      models: prev.models.filter((m) => m.nom !== name),
    }));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    );
    setToggleEditModal("none");
  }, [setProject]);

  const handleEditModel = useCallback((index) => {
    setSelectedModelIndex(index);
    setToggleEditModal("block");
    setToggleModal("none");
  }, []);

  useEffect(() => {
    const setter = (updatedNodes) => {
      setNodes(updatedNodes);
    };
    const edgeSetter = (newEdges) => {
      setEdges(newEdges);
    };
    if (project != null && project.models != null) {
      const updatedNodes = project.models
        .map((model, index) => {
          if (model && Object.keys(model).length > 0) {
            const nodeId = "model-" + model.nom;
            const existingNode = nodes.find((n) => n.id === nodeId);

            return {
              id: nodeId,
              type: "model",
              position: existingNode
                ? existingNode.position
                : { x: (index % 3) * 350, y: Math.floor(index / 3) * 300 },
              data: {
                nom: model.nom,
                champs: [...model.champs],
                onDelete: () => deleteModel(model.nom),
                onEdit: () => handleEditModel(index),
              },
            };
          }
          return null;
        })
        .filter(Boolean);
      setter(updatedNodes);

      const newEdges = [];
      project.models.forEach((model) => {
        const sourceId = "model-" + model.nom;
        (model.champs || []).forEach((field) => {
          const constraints = Array.isArray(field.constraint)
            ? field.constraint
            : [];
          constraints.forEach((c) => {
            if (typeof c === "string" && c.startsWith("relation:")) {
              const targetTable = c.split(":")[1].split(".")[0];
              const targetId = "model-" + targetTable;

              if (project.models.some((m) => m.nom === targetTable)) {
                newEdges.push({
                  id: `edge-${sourceId}-${targetId}-${field.nom}`,
                  source: sourceId,
                  target: targetId,
                  label: field.nom,
                  animated: true,
                  style: { stroke: "#4f46e5", strokeWidth: 2 },
                });
              }
            }
          });
        });
      });
      edgeSetter(newEdges);
    }
  }, [project, deleteModel]);

  const handleNewModelModal = () => {
    if (toggleModal == "none") {
      setToggleModal("block");
    } else {
      setToggleModal("none");
    }
  };

  const onNodeClick = useCallback(
    (event, node) => {
      const index = project.models.findIndex(
        (m) => "model-" + m.nom === node.id,
      );
      if (index !== -1) {
        setSelectedModelIndex(index);
        setToggleEditModal("block");
        setToggleModal("none");
      }
    },
    [project],
  );

  

  const savedb = useCallback(async () => {
    showToast("Sauvegarde en cours...", "loading");

    try {
      const res = await GoApp.fetchProjectByName(projectName);
      if (res) {
        res.bdd = project;
        await GoApp.saveProject(projectName, JSON.stringify(res));
        showToast("Database saved successfully !");
      }
    } catch (error) {
      showToast("Erreur lors de la sauvegarde", error);
    }
  }, [projectName, project]);

  const reorganizeNodes = useCallback(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node, index) => ({
        ...node,
        position: { x: (index % 3) * 350, y: Math.floor(index / 3) * 300 },
      })),
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z
      if (isCtrlOrMeta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y ou Ctrl+Shift+Z
      else if ((isCtrlOrMeta && e.key.toLowerCase() === "y") || (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        handleRedo();
      }
      // Sauvegarde (Ctrl+S)
      else if (isCtrlOrMeta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        savedb();
      }
      // Retour ou fermeture de modale (Escape)
      else if (e.key === "Escape") {
        if (
          toggleModal !== "none" ||
          toggleEditModal !== "none" ||
          toggleUserModal !== "none"
        ) {
          setToggleModal("none");
          setToggleEditModal("none");
          setToggleUserModal("none");
        } else {
          navigateTo("Dashboard");
        }
      }
      // Réorganisation (Ctrl+Shift+L)
      else if (
        isCtrlOrMeta &&
        e.shiftKey &&
        e.key.toLowerCase() === "l"
      ) {
        e.preventDefault();
        reorganizeNodes();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    project,
    toggleModal,
    toggleEditModal,
    toggleUserModal,
    savedb,
    reorganizeNodes,
    navigateTo,
    handleUndo,
    handleRedo,
  ]);

  const [showQueryBuilder, setShowQueryBuilder] = useState(false);

  return (
    <div className="flex w-screen h-screen flex-col bg-couleur3 dark:bg-couleur6 ">
      {project?.models != null && (
        <button
          className="z-50 fixed bottom-20 right-2 dark:bg-couleur1 p-2 rounded-lg dark:text-couleur3 cursor-pointer"
          onClick={() => setShowQueryBuilder(!showQueryBuilder)}
        >
          <Code2 />
        </button>
      )}
      {showQueryBuilder && (
        <div className="z-50 fixed mx-auto h-screen w-screen overflow-scroll py-5">
          <QueryBuilder tables={project.models} onClose={() => setShowQueryBuilder(false)} />
        </div>
      )}
      <div className="p-3 pb-4 h-fit flex items-center justify-between fixed z-30 w-full border-b border-couleur1/10 dark:border-white/10 -top-16 hover:top-0 transition-all duration-300 ease-in-out bg-couleur3/90 dark:bg-gray-900/90 backdrop-blur-md rounded-b-2xl shadow-xl box-border group">

        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-couleur1 dark:bg-gray-700 text-couleur3 dark:text-gray-200 text-[10px] px-3 py-0.5 rounded-b-md opacity-70 group-hover:opacity-0 transition-opacity pointer-events-none font-mono">
          Hover to expand editor bar
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2.5 rounded-xl border border-couleur1/20 dark:border-white/20 bg-couleur5 dark:bg-gray-800 text-couleur1 dark:text-gray-100 hover:bg-couleur1/10 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            title="Go back"
            onClick={() => navigateTo("Dashboard")}
          >
            <FcPrevious size={18} />
          </button>

          <h1 className="text-couleur1 dark:text-gray-100 text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="opacity-60 text-lg font-medium">{t("DB Editor :")}</span>
            <span>{projectName}</span>
          </h1>
        </div>

        {/* Actions, Undo/Redo & Menu */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          
          {/* Boutons Undo / Redo intégrés */}
          <div className="flex items-center bg-couleur5 dark:bg-gray-800 border border-couleur1/20 dark:border-white/10 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
                canUndo
                  ? "text-couleur1 dark:text-gray-100 hover:bg-couleur1/10 dark:hover:bg-gray-700"
                  : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
              }`}
            >
              <RotateCcw size={16} />
            </button>
            <div className="w-px h-4 bg-couleur1/10 dark:bg-white/10 my-auto"></div>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
                canRedo
                  ? "text-couleur1 dark:text-gray-100 hover:bg-couleur1/10 dark:hover:bg-gray-700"
                  : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
              }`}
            >
              <RotateCw size={16} />
            </button>
          </div>

          <button
            className="flex gap-2 text-white bg-couleur1 hover:bg-couleur1/90 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 items-center cursor-pointer text-xs sm:text-sm"
            onClick={savedb}
          >
            <Save size={16} />
            <span>Save</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:p-2.5 text-couleur1 dark:text-gray-200 border border-couleur1/20 dark:border-white/20 rounded-xl hover:bg-couleur1/10 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95 cursor-pointer"
              title={t("More options")}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-couleur1/10 dark:border-white/10 z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 dark:hover:bg-gray-700/60 rounded-xl transition-colors cursor-pointer"
                    onClick={() => {
                      reorganizeNodes();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LayoutGrid size={18} className="text-couleur1 dark:text-gray-300" />
                    <span>Reorganize Layout</span>
                  </button>

                  {subscription?.subscription != null && (
                    <button
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-couleur1/10 dark:hover:bg-gray-700/60 rounded-xl transition-colors cursor-pointer"
                      onClick={() => {
                        setToggleUserModal("block");
                        setIsMenuOpen(false);
                      }}
                    >
                      <User size={18} className="text-couleur1 dark:text-gray-300" />
                      <span>Generate User Table</span>
                    </button>
                  )}

                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
                  <button
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-couleur1 dark:text-white hover:bg-couleur1/10 dark:hover:bg-gray-700/60 rounded-xl transition-colors cursor-pointer"
                    onClick={() => {
                      const funct = () => {
                        handleNewModelModal();
                        setIsMenuOpen(false);
                      };

                      if (
                        subscription?.subscription != "pro" ||
                        (subscription?.subscription == null &&
                          project.models.length < 5)
                      ) {
                        funct();
                      } else if (subscription.subscription == "pro") {
                        funct();
                      } else {
                        showToast(
                          t("Activate Turbo stack to add more table"),
                          "error",
                        );
                      }
                    }}
                  >
                    <Plus size={18} />
                    <span>Add New Table </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}
      >
        {project && (
          <NewModel
            setModelList={setProject}
            modelList={project}
            setToggle={setToggleModal}
          />
        )}
      </div>
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 transform ${toggleUserModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}
      >
        {project && (
          <GenerateUserTable
            setModelList={setProject}
            modelList={project}
            setToggle={setToggleUserModal}
          />
        )}
      </div>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 ease-out transform ${toggleEditModal === "block" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none invisible"}`}
      >
        {selectedModelIndex !== null && project && (
          <EditModel
            setModelList={setProject}
            modelList={project}
            setToggle={setToggleEditModal}
            index={selectedModelIndex}
          />
        )}
      </div>

      {toast && (
        <div
          className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${
            toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : toast.type === "loading"
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {toast.type === "loading" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : toast.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="w-auto h-full bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          nodeTypes={nodeType}
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}