package entity

import (
	"fmt"
	"os"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/goapimaker"
)

type GoApiMaker struct{}

func (mgr *GoApiMaker) setupFileArch(name string) {
	projectPath := fmt.Sprintf("%s/api/", name)
	for _, val := range goapimaker.DirList {
		config.CheckCreateDir(projectPath + val)
	}
}

func (api *GoApiMaker) modelAPIExporter(models []Model, projectName string) {
	for _, model := range models {
		mName := model.GetNom()
		if mName == "" {
			continue
		}
		n := strings.ReplaceAll(mName, " ", "_")
		filePath := fmt.Sprintf("%s/%s/api/src/models/%s.go", config.PROJECT_DIR, projectName, strings.ToLower(n))
		file, err := os.Create(filePath)
		if err != nil {
			fmt.Printf("Error creating model file %s : %v\n", filePath, err)
			continue
		}

		var sb strings.Builder
		sb.WriteString("package models\n\n")
		structName := strings.ToUpper(mName[:1]) + mName[1:]
		fmt.Fprintf(&sb, "type %s struct {\n", structName)

		for _, field := range model.GetAttributs() {
			fieldName := strings.ToUpper(field.GetNom()[:1]) + field.GetNom()[1:]
			goType := goapimaker.MapToGoType(field.GetType())
			fmt.Fprintf(&sb, "\t%s %s `json:\"%s\"`\n", fieldName, goType, strings.ToLower(field.GetNom()))
		}
		sb.WriteString("}\n")
		file.WriteString(sb.String())
		file.Close()
	}
}
func (mgr *GoApiMaker) routesAPIExporter(endpoints []Endpoint, projectName string) {
	filePath := fmt.Sprintf("%s/%s/api/src/routes/routes.go", config.PROJECT_DIR, projectName)
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Printf("Error creating routes file %s : %v\n", filePath, err)
		return
	}
	defer file.Close()

	var sb strings.Builder
	sb.WriteString("package routes\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"net/http\"\n")
	sb.WriteString("\t\"" + projectName + "src/controllers\"\n")
	sb.WriteString(")\n\n")

	// Groupement des endpoints par nom de modèle
	groups := make(map[string][]Endpoint)
	for _, ep := range endpoints {
		mName := "General"
		if len(ep.GetModel()) > 0 {
			mName = ep.GetModel()[0].GetNom()
		}
		groups[mName] = append(groups[mName], ep)
	}

	for groupName, eps := range groups {
		cleanGroupName := strings.ReplaceAll(groupName, " ", "_")
		groupFuncName := strings.ToUpper(cleanGroupName[:1]) + cleanGroupName[1:]
		fmt.Fprintf(&sb, "func RegisterRoutes%s(mux *http.ServeMux) {\n", groupFuncName)
		for _, ep := range eps {
			method := ep.GetMethod()
			uri := ep.GetUri()
			eName := ep.GetNom()
			funcName := strings.ToUpper(eName[:1]) + strings.ReplaceAll(eName[1:], " ", "_")
			fmt.Fprintf(&sb, "\tmux.HandleFunc(\"%s %s\", controllers.%s)\n", method, uri, funcName)
		}
		sb.WriteString("}\n\n")
	}
	file.WriteString(sb.String())
}

func (mgr *GoApiMaker) controllerAPIExporter(endpoints []Endpoint, projectName string) {
	for _, ep := range endpoints {
		fmt.Println(ep)
		eName := ep.GetNom()
		if eName == "" {
			continue
		}

		filePath := fmt.Sprintf("%s/%s/api/src/controllers/%s.go", config.PROJECT_DIR, projectName, strings.ToLower(strings.ReplaceAll(eName, " ", "_")))
		file, err := os.Create(filePath)
		if err != nil {
			fmt.Printf("Error creating controller %s : %v\n", filePath, err)
			continue
		}

		var sb strings.Builder
		goapimaker.ControllerImportWriter(sb, projectName)

		funcName := strings.ToUpper(eName[:1]) + eName[1:]

		// Identification du modèle associé
		var activeModel Model
		if len(ep.GetModel()) > 0 {
			activeModel = ep.GetModel()[0]
		}
		modelName := activeModel.GetNom()

		fmt.Fprintf(&sb, "// %s handles the %s request for %s\n", funcName, ep.GetMethod(), ep.GetUri())
		fmt.Fprintf(&sb, "func %s(w http.ResponseWriter, r *http.Request) {\n", strings.ReplaceAll(funcName, " ", "_"))

		if modelName != "" {
			structName := strings.ToUpper(modelName[:1]) + modelName[1:]
			tableName := strings.ToLower(modelName)

			var columns []string
			var scanTargets []string
			for _, attr := range activeModel.GetAttributs() {
				columns = append(columns, strings.ToLower(attr.GetNom()))
				scanTargets = append(scanTargets, "&item."+strings.ToUpper(attr.GetNom()[:1])+attr.GetNom()[1:])
			}
			switch ep.method {
			case "DELETE":
				fmt.Fprint(&sb, goapimaker.Delete(tableName, ep.params[0]))
			case "PUT":
				var attrs []string
				for i, val := range ep.model[0].attributs{
					attrs = append(attrs, fmt.Sprintf("%s = $%d", val.nom, i+1))
				}
				fmt.Fprint(&sb, goapimaker.Update(tableName, attrs, ep.params[0]))
			case "GET":
				if len(ep.params)>0 {
					fmt.Fprint(&sb, goapimaker.SelectBy(tableName, ep.params[0]))
				}else{
					fmt.Fprint(&sb, goapimaker.Select(tableName))
				}
			case "POST":
				var attrs []string
				for _, val := range ep.model[0].attributs{
					attrs = append(attrs, fmt.Sprintf("%s", val.nom))
				}
				fmt.Fprint(&sb, goapimaker.Insert(tableName, attrs))
			}

			sb.WriteString("\tif err != nil {\n\t\thttp.Error(w, err.Error(), http.StatusInternalServerError)\n\t\treturn\n\t}\n\tdefer rows.Close()\n\n")
			fmt.Fprintf(&sb, "\tvar results []models.%s\n", structName)
			fmt.Fprintf(&sb, "\tfor rows.Next() {\n\t\tvar item models.%s\n", structName)
			fmt.Fprintf(&sb, "\t\tif err := rows.Scan(%s); err != nil {\n\t\t\tcontinue\n\t\t}\n", strings.Join(scanTargets, ", "))
			sb.WriteString("\t\tresults = append(results, item)\n\t}\n")
			sb.WriteString("\tjson.NewEncoder(w).Encode(results)\n")
		} else {
			fmt.Fprintf(&sb, "\tjson.NewEncoder(w).Encode(map[string]string{\"message\": \"%s endpoint reached\"})\n", eName)
		}

		sb.WriteString("}\n")

		file.WriteString(sb.String())
		file.Close()
	}
}

func (mgr *GoApiMaker) middlewareAPIExporter(projectName string) {
	goapimaker.MiddlewareWriter(projectName)
}

func (mgr *GoApiMaker) mainAPIExporter(endpoints []Endpoint, projectName string) {
	filePath := fmt.Sprintf("%s/%s/api/main.go", config.PROJECT_DIR, projectName)
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Printf("Error creating main file %s : %v\n", filePath, err)
		return
	}
	defer file.Close()

	var sb strings.Builder
	sb.WriteString("package main\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"fmt\"\n")
	sb.WriteString("\t\"log\"\n")
	sb.WriteString("\t\"net/http\"\n")
	sb.WriteString("\t\"" + projectName + "/src/config\"\n")
	sb.WriteString("\t\"" + projectName + "/src/routes\"\n")
	sb.WriteString("\t\"" + projectName + "/src/middlewares\"\n")
	sb.WriteString(")\n\n")

	sb.WriteString("func main() {\n")
	sb.WriteString("\t// 1. Initialisation de la base de données\n")
	sb.WriteString("\tconfig.InitDB()\n\n")
	sb.WriteString("\t// 2. Initialisation du Router (Mux)\n")
	sb.WriteString("\tmux := http.NewServeMux()\n\n")

	// Récupération des groupes de routes (logique identique à routesAPIExporter)
	groups := make(map[string]bool)
	for _, ep := range endpoints {
		mName := "General"
		if len(ep.GetModel()) > 0 {
			mName = ep.GetModel()[0].GetNom()
		}
		groups[mName] = true
	}

	sb.WriteString("\t// 3. Enregistrement des routes par modèle\n")
	for groupName := range groups {
		cleanGroupName := strings.ReplaceAll(groupName, " ", "_")
		groupFuncName := strings.ToUpper(cleanGroupName[:1]) + cleanGroupName[1:]
		fmt.Fprintf(&sb, "\troutes.RegisterRoutes%s(mux)\n", groupFuncName)
	}

	sb.WriteString("\n\t// 4. Application du middleware CORS\n")
	sb.WriteString("\thandler := middlewares.CorsMiddleware(mux)\n\n")

	sb.WriteString("\t// 5. Lancement du serveur\n")
	sb.WriteString("\tport := \":8080\"\n")
	sb.WriteString("\tfmt.Printf(\"🚀 TurboStack API running on http://localhost%s\\n\", port)\n")
	sb.WriteString("\tlog.Fatal(http.ListenAndServe(port, handler))\n")
	sb.WriteString("}\n")

	file.WriteString(sb.String())
}

func (mgr *GoApiMaker) configAPIExporter(projectName string) {
	filePath := fmt.Sprintf("%s/%s/api/src/config/db.go", config.PROJECT_DIR, projectName)
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Printf("Error creating config file %s : %v\n", filePath, err)
		return
	}
	defer file.Close()

	var sb strings.Builder
	sb.WriteString("package config\n\n")
	sb.WriteString("import (\n")
	sb.WriteString("\t\"database/sql\"\n")
	sb.WriteString("\t\"fmt\"\n")
	sb.WriteString("\t\"log\"\n")
	sb.WriteString("\t_ \"github.com/lib/pq\"\n")
	sb.WriteString(")\n\n")

	sb.WriteString("var DB *sql.DB\n\n")
	sb.WriteString("// InitDB initialise la connexion à la base de données PostgreSQL\n")
	sb.WriteString("func InitDB() {\n")
	sb.WriteString("\t// Modifiez cette chaîne de connexion selon votre environnement\n")
	sb.WriteString("\tconnStr := \"user=postgres password=root dbname=postgres sslmode=disable host=localhost port=5432\"\n")
	sb.WriteString("\tvar err error\n")
	sb.WriteString("\tDB, err = sql.Open(\"postgres\", connStr)\n")
	sb.WriteString("\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n\n")
	sb.WriteString("\tif err = DB.Ping(); err != nil {\n\t\tlog.Fatal(err)\n\t}\n\n")
	sb.WriteString("\tfmt.Println(\"Successfully connected to database\")\n")
	sb.WriteString("}\n")

	file.WriteString(sb.String())
}
