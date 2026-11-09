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
	err := os.MkdirAll(filepath.Join(projectPath, "static", "swagger"), 0755)
	utils.ErrorChecker(err)

	err = os.WriteFile(filepath.Join(projectPath, "static", "swagger", "swagger-ui.css"), cssFile, 0755)
	utils.ErrorChecker(err)
	err = os.WriteFile(filepath.Join(projectPath, "static", "swagger", "swagger-ui-bundle.js"), jsFile, 0755)
	utils.ErrorChecker(err)
}

// GenerateAndWriteOpenAPIJson génère et écrit le fichier openapi.json à la racine du projet exporté
func GenerateAndWriteOpenAPIJson(projectPath string, project *Project) error {
	paths := make(map[string]interface{})
	api := project.GetRestApi()
	CopySwaggerUiDir(projectPath)
	// Récupérer les modèles de la base de données pour mapper les schémas si nécessaire
	bddModels := make(map[string]interface{})
	bdd := project.GetBDD()
	for _, model := range bdd.GetModels() {
		properties := make(map[string]interface{})
		for _, field := range model.GetAttributs() {
			// Mapper les types Go/DB vers les types OpenAPI (string, integer, boolean, etc.)
			fieldType := "string"
			if field.GetType() == "int" || field.GetType() == "integer" {
				fieldType = "integer"
			} else if field.GetType() == "bool" || field.GetType() == "boolean" {
				fieldType = "boolean"
			}
			properties[field.GetNom()] = map[string]interface{}{
				"type": fieldType,
			}
		}
		bddModels[model.GetNom()] = map[string]interface{}{
			"type":       "object",
			"properties": properties,
		}
	}

	for _, ep := range api.GetEndpoints() {
		uri := ep.GetUri()
		for _, param := range ep.GetParams() {
			uri = strings.ReplaceAll(uri, ":"+param, "{"+param+"}")
		}

		pathItem, exists := paths[uri].(map[string]interface{})
		if !exists {
			pathItem = make(map[string]interface{})
		}

		method := strings.ToLower(ep.GetMethod())

		// Définition de l'opération OpenAPI de base
		operation := map[string]interface{}{
			"summary":     ep.GetNom(),
			"description": "Rôle d'accès : " + ep.GetRole(),
			"responses": map[string]interface{}{
				"200": map[string]interface{}{
					"description": "Succès de la requête",
					"content": map[string]interface{}{
						"application/json": map[string]interface{}{
							"schema": map[string]interface{}{
								"type": "object",
								"properties": map[string]interface{}{
									"message": map[string]interface{}{
										"type":    "string",
										"example": "Opération réussie",
									},
								},
							},
						},
					},
				},
			},
		}

		// Ajouter un Request Body automatique pour les méthodes POST, PUT, PATCH si le body est présent/attendu
		if method == "post" || method == "put" || method == "patch" {
			// Tu peux adapter cette condition selon la structure exacte de ton objet endpoint (ex: ep.GetBody() ou ep.GetFields())
			properties := map[string]interface{}{
				"data": map[string]interface{}{
					"type":        "object",
					"description": "Données envoyées dans le corps de la requête",
				},
			}

			operation["requestBody"] = map[string]interface{}{
				"required": true,
				"content": map[string]interface{}{
					"application/json": map[string]interface{}{
						"schema": map[string]interface{}{
							"type":       "object",
							"properties": properties,
						},
					},
				},
			}
		}

		pathItem[method] = operation
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

	// Optionnel : Injecter les composants de schémas globaux s'ils existent
	if len(bddModels) > 0 {
		openApiSpec["components"] = map[string]interface{}{
			"schemas": bddModels,
		}
	}

	jsonData, err := json.MarshalIndent(openApiSpec, "", "  ")
	if err != nil {
		return err
	}

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
