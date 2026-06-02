import { useEffect, useState } from "react";
import { useNavigate } from "../../hooks/useNavigate";
import { GoApp } from "../../services/bridge";
import SideMenu from "../../components/sideMenu";
import { useSelector } from "react-redux"; // Assuming projectName is in Redux
import {
  Settings,
  List,
  Database,
  User,
  Globe,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function APIlist() {
  const navigateTo = useNavigate();
  const projectName = useSelector((state) => state.app.actualProject);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadProject = async () => {
      if (!projectName) {
        setError(
          "No project selected. Please go to the Project Dashboard and select a project.",
        );
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await GoApp.fetchProjectByName(projectName);
        // console.log(res)
        if (res) {
          setProject(res);
          setError(null);
        } else {
          setError(`Project '${projectName}' not found.`);
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectName]);

  useEffect(() => {
    const endpoints = project?.rest_api?.endpoints || [];
    const totalPages = Math.ceil(endpoints.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [project, currentPage]);

  // Derive available roles (same logic as in endpoint forms)
  const availableModels = project?.bdd?.models || [];
  const userModel = availableModels.find((m) => m.nom === "User");
  const roleField = userModel?.champs.find((c) => c.nom === "role");
  const availableRoles = roleField?.default_value
    ? ["public", ...roleField.default_value.split(",").map((r) => r.trim())]
    : ["public"];

  // Helper for method colors
  const methodColors = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PUT: "bg-amber-500",
    DELETE: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu />
        <div className="flex-1 flex items-center justify-center text-couleur1 text-xl">
          Loading API details for {projectName || "selected project"}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full font-san bg-couleur3">
        <SideMenu />
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 text-xl">
          <p>{error}</p>
          {!projectName && (
            <button
              onClick={() => navigateTo("Project")}
              className="mt-4 px-4 py-2 bg-couleur1 text-white rounded-lg hover:bg-opacity-90"
            >
              Go to Project Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const endpoints = project?.rest_api?.endpoints || [];
  const totalEndpoints = endpoints.length;
  const totalPages = Math.ceil(totalEndpoints / itemsPerPage);

  const currentEndpoints = endpoints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex h-screen w-full font-san bg-couleur3">
      <SideMenu></SideMenu>
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-couleur1 text-3xl font-semibold mb-6 flex items-center gap-3">
          <Settings size={32} /> API Details for {projectName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-couleur1/10">
            <div className="flex items-center gap-3 mb-3">
              <List size={24} className="text-couleur1" />
              <h2 className="text-xl font-bold text-couleur1">
                Endpoints Summary
              </h2>
            </div>
            <p className="text-gray-700">
              Total Endpoints:{" "}
              <span className="font-semibold">{totalEndpoints}</span>
            </p>
            <button
              onClick={() => navigateTo("api_editor")} // Assuming 'api_editor' is the route to the editor
              className="mt-4 px-4 py-2 bg-couleur1 text-white rounded-lg hover:bg-opacity-90 text-sm"
            >
              Go to API Editor
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-couleur1/10">
            <div className="flex items-center gap-3 mb-3">
              <User size={24} className="text-couleur1" />
              <h2 className="text-xl font-bold text-couleur1">
                Available Roles
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-couleur3 text-couleur1 rounded-full text-sm capitalize"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-couleur1 mb-4 flex items-center gap-2">
          <Globe size={24} /> Endpoints List
        </h2>
        {totalEndpoints === 0 ? (
          <p className="text-gray-600 italic">
            No endpoints defined yet. Use the API Editor to add some.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEndpoints.map((ep, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-couleur1/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold text-white px-2 py-1 rounded ${methodColors[ep.method] || "bg-gray-500"}`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-sm font-semibold text-couleur1">
                      {ep.nom}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono mb-2">
                    {ep.uri}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <Tag size={12} /> Role:{" "}
                    <span className="capitalize font-medium">
                      {ep.role || "public"}
                    </span>
                  </p>

                  {(ep.model?.length > 0 || ep.manual_fields?.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-couleur1/5">
                      <p className="text-xs font-bold text-gray-500 mb-1">
                        Associated Models/Fields:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ep.model?.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-couleur3 text-couleur1 rounded-full text-[10px]"
                          >
                            {m.nom} ({m.champs?.length || 0} fields)
                          </span>
                        ))}
                        {ep.manual_fields?.map((f, i) => (
                          <span
                            key={`manual-${i}`}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]"
                          >
                            {f.nom} ({f.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className="p-2 rounded-lg border border-couleur1 text-couleur1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg border transition-all ${
                        currentPage === i + 1
                          ? "bg-couleur1 text-white border-couleur1 shadow-md"
                          : "border-couleur1/30 text-couleur1 hover:border-couleur1"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="p-2 rounded-lg border border-couleur1 text-couleur1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-couleur3 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
