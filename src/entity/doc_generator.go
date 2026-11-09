package entity

import (
	"embed"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/utils"
)

//go:embed static/*
var swagger_dir embed.FS

func CopySwaggerUiDir(projectPath string) {
	cssFile, _ := swagger_dir.ReadFile("static/swagger/swagger-ui.css")
	jsFile, _ := swagger_dir.ReadFile("static/swagger/swagger-ui-bundle.js")
	err := os.MkdirAll(filepath.Join(projectPath, "static", "sawwger"), 0755)
	utils.ErrorChecker(err)

	err = os.WriteFile(filepath.Join(projectPath, "static", "swagger", "swagger-ui.css"), cssFile, 0755)
	utils.ErrorChecker(err)
	err = os.WriteFile(filepath.Join(projectPath, "static", "swagger", "swagger-ui-bunlde.js"), jsFile, 0755)
	utils.ErrorChecker(err)
}

// GenerateAndWriteOpenAPIJson génère et écrit le fichier openapi.json à la racine du projet exporté
func GenerateAndWriteOpenAPIJson(projectPath string, project *Project) error {
	// 1. Construire la structure de la spec OpenAPI à partir des endpoints du projet
	paths := make(map[string]interface{})
	api := project.GetRestApi()
	for _, ep := range api.GetEndpoints() {
		// Convertir les paramètres URI type /:id en format OpenAPI /{id}
		uri := ep.GetUri()
		for _, param := range ep.GetParams() {
			uri = strings.ReplaceAll(uri, ":"+param, "{"+param+"}")
		}

		pathItem, exists := paths[uri].(map[string]interface{})
		if !exists {
			pathItem = make(map[string]interface{})
		}

		method := strings.ToLower(ep.GetMethod())
		pathItem[method] = map[string]interface{}{
			"summary":     ep.GetNom(),
			"description": "Rôle d'accès : " + ep.GetRole(),
			"responses": map[string]interface{}{
				"200": map[string]interface{}{
					"description": "Succès de la requête",
				},
			},
		}
		paths[uri] = pathItem
	}

	openApiSpec := map[string]interface{}{
		"openapi": "3.0.0",
		"info": map[string]interface{}{
			"title":       project.GetNom(),
			"description": "Documentation de l'API générée par TurboStack",
			"version":     "1.0.0",
		},
		"paths": paths,
	}

	// 2. Sérialiser en JSON joliment formaté (indenté)
	jsonData, err := json.MarshalIndent(openApiSpec, "", "  ")
	if err != nil {
		return err
	}

	// 3. Écrire le fichier openapi.json dans le dossier du projet exporté
	filePath := filepath.Join(projectPath, "openapi.json")
	return os.WriteFile(filePath, jsonData, 0644)
}

// GenerateDocsHandlerFile génère le fichier Go qui gère la route /docs dans l'application exportée
func GenerateDocsHandlerFile(projectPath string) error {
	handlerCode := `package handlers

import (
	"net/http"
)

// RegisterDocsRoute enregistre la route /docs et sert le fichier openapi.json hors-ligne
func RegisterDocsRoute(mux *http.ServeMux) {
	// Servir le fichier openapi.json généré à la racine
	mux.HandleFunc("/openapi.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		http.ServeFile(w, r, "./openapi.json")
	})

	// Route de la documentation (Swagger UI 100% offline avec assets locaux)
	mux.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		html := ` + "`" + `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>API Documentation</title>
    <link rel="stylesheet" href="/static/swagger/swagger-ui.css" />
    <style>
        body { margin: 0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="/static/swagger/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/openapi.json',
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
                layout: "BaseLayout",
            });
        };
    </script>
</body>
</html>` + "`" + `
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(html))
	})

	// Servir les assets statiques (swagger-ui.css et swagger-ui-bundle.js) depuis le dossier static/swagger
	fs := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))
}
`

	// Écrire ce code dans le projet exporté (ex: dossier handlers/)
	handlersDir := filepath.Join(projectPath, "handlers")
	if err := os.MkdirAll(handlersDir, 0755); err != nil {
		return err
	}

	filePath := filepath.Join(handlersDir, "docs.go")
	return os.WriteFile(filePath, []byte(handlerCode), 0644)
}