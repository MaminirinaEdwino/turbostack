package entity

import (
	"fmt"
	"os"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/goapimaker"
	"github.com/MaminirinaEdwino/turbostack/src/utils"
)

type webAppMaker struct {
	ProjectName string
	WebApp      WebApp
	Techno      string
	Api         RestApi
}

func (wap *webAppMaker) SetupArch() {
	projectpath := fmt.Sprintf("%s/web-app/", wap.ProjectName)
	folderList := []string{
		"src/views",
		"src/controller",
		"src/models",
		"src/static",
		"src/router",
		"src/config",
		"src/static/css",
		"src/static/assets",
	}
	for _, dir := range folderList {
		config.CheckCreateDir(projectpath + dir)
	}
}

func WebAppSelectTemplate(query, dbCaller, returnType, scanValue, pageName string) string {
	return fmt.Sprintf(`func (w http.ResponseWriter, r *http.Request){
	%s
	%s
	rows, err := db.Query("SELECT %s")
	if err != nil {
		http.Error(w, "Erreur BDD: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var returnValue []returnType
	for rows.Next() {
		var u returnType
		if err := rows.Scan(%s); err != nil {
			continue
		}
		returnValue = append(returnValue, u)
	}

	renderTemplate(w, "%s.html", map[string]interface{}{
		"ReturnContent": returnValue,
	})
}`, returnType, dbCaller, query, scanValue, pageName)
}

func WebAppPostViewtemplate(pageName string) string {
	return fmt.Sprintf(`func (w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "%s.html", map[string]interface{}{
		"Title": "Create",
	})
}`, pageName)
}

func WebAppPostActionTemplate(dbCaller, redirectUri, paramsExtraction, paramsChecker, query, paramsExec string) string {
	return fmt.Sprintf(`func (w http.ResponseWriter, r *http.Request) {
	// Parsing de la Form Data
	%s
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s

	if %s {
		http.Error(w, "Les champs 'name' et 'email' sont requis", http.StatusBadRequest)
		return
	}

	// Insertion PostgreSQL via driver pq
	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur lors de la création: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection Post-Redirect-Get vers la liste
	http.Redirect(w, r, "%s", http.StatusSeeOther)
}`, dbCaller, paramsExtraction, paramsChecker, query, paramsExec, redirectUri)
}

func WebAppEditTemplate(dbCaller, params, returnType, query, scanValue, pageName string) string {
	return fmt.Sprintf(`func HandleUserEdit(w http.ResponseWriter, r *http.Request) {
	%s
	%s := r.PathValue("%s")
	%s
	var returnValue ReturnType
	query := "%s"
	err := db.QueryRow(query, %s).Scan(%s)
	if err != nil {
		http.Error(w, "Utilisateur introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, "%s.html", map[string]interface{}{
		"ReturnValue": returnValue,
	})
}`, dbCaller, params, params, returnType, query, params, scanValue, pageName)
}

func WebAppEditActionTemplate(dbCaller, params, contentExtraction, query, queryValue, redirectUri string) string {
	return fmt.Sprintf(`func (w http.ResponseWriter, r *http.Request) {
	%s
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s := r.PathValue("%s")
	%s

	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur lors de la mise à jour: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Redirection vers la page de détails de l'utilisateur
	http.Redirect(w, r, "%s"+%s, http.StatusSeeOther)
}`, dbCaller, params, params, contentExtraction, query, queryValue, redirectUri, params)
}

func WebAppDeleteActionTemplate(dbCaller, params, query, redirectUri string) string {
	return fmt.Sprintf(`func HandleUserDelete(w http.ResponseWriter, r *http.Request) {
	%s
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		r.ParseForm()
	}

	%s := r.FormValue("%s")

	query := "%s"
	_, err := db.Exec(query, %s)
	if err != nil {
		http.Error(w, "Erreur suppression: "+err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "%s", http.StatusSeeOther)
}`, dbCaller, params, params, query, params, redirectUri)
}

func DBCallerTemplate() string {
	return `
db := config.DB
defer db.Close()
	`
}

func WebAppSelectByParamsTemplate(query, dbCaller, returnType, scanValue, pageName, uriParams string) string {
	return fmt.Sprintf(`
	%s := r.PathValue("%s")
	%s
	var returnValue returnType
	query := "SELECT id, name, email FROM users WHERE %s = $1"
	err := db.QueryRow(query, %s).Scan(%s)
	if err != nil {
		http.Error(w, "model introuvable", http.StatusNotFound)
		return
	}

	renderTemplate(w, "%s.html", map[string]interface{}{
		"ReturnContent": returnValue,
	})
	`, uriParams, uriParams, returnType, uriParams, uriParams, scanValue, pageName)
}

func (wap *webAppMaker) CreateModelFile() {
	if wap.Techno == "go" {
		modelMaker := GoApiMaker{}
		modelMaker.modelAPIExporter(wap.WebApp.bdd.models, wap.ProjectName)
	}
}

func (wap *webAppMaker) CreateConfigFile() {
	if wap.Techno == "go" {
		wap.configAPIExporter(wap.ProjectName)
	}
}

func (mgr *webAppMaker) configAPIExporter(projectName string) {
	filePath := fmt.Sprintf("%s/%s/web-app/src/config/db.go", config.PROJECT_DIR, projectName)
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

func (wap *webAppMaker) HandleURIParamsSyntaxeForGo(uri string) string {
	uriTab := strings.Split(uri, "/")
	for _, val := range uriTab {
		if strings.Contains(val, ":") {
			val = fmt.Sprintf("{%s}", strings.Replace(val, ":", "", -1))
		}
	}
	return strings.Join(uriTab, "/")
}

func (wap *webAppMaker) WriteBodyType(endpoint Endpoint) string {
	var strBuilder strings.Builder
	fmt.Fprint(&strBuilder, "type bodyType struct{\n")
	for _, val := range endpoint.model {
		for _, field := range val.attributs {
			fmt.Fprintf(&strBuilder, "%s %s `json:\"%s\"`", utils.ToUpperFirstLetter(field.nom), field.type_champs, field.nom)
		}
	}
	fmt.Fprint(&strBuilder, "}\n")
	return strBuilder.String()
}
func (wap *webAppMaker) WriteReturnType(endpoint Endpoint) string {
	var strBuilder strings.Builder
	fmt.Fprint(&strBuilder, "type returnType struct{\n")
	for _, val := range endpoint.returnContent {
		for _, field := range val.attributs {
			fmt.Fprintf(&strBuilder, "%s %s `json:\"%s\"`\n", utils.ToUpperFirstLetter(field.nom), field.type_champs, field.nom)
		}
	}
	fmt.Fprint(&strBuilder, "}\n")
	return strBuilder.String()
}

func (wap *webAppMaker) WriteParamsGetter(endpoint Endpoint) string {
	var strBuilder strings.Builder
	for _, val := range endpoint.params {
		fmt.Fprintf(&strBuilder, "%s := r.PathValue(\"%s\")\n", val, val)
	}
	return strBuilder.String()
}

func (wap *webAppMaker) WriteScanValue(endpoint Endpoint) string {
	var strBuilder []string
	for _, val := range endpoint.returnContent {
		for _, mod := range val.attributs {
			strBuilder = append(strBuilder, fmt.Sprintf("&u.%s", utils.ToUpperFirstLetter(mod.nom)))
		}
	}
	return strings.Join(strBuilder, ", ")
}

func (wap *webAppMaker) WriteContentExtraction(endpoint Endpoint) string {
	var str []string
	for _, val := range endpoint.model[0].attributs {
		str = append(str, fmt.Sprintf("%s := r.FormValue(\"%s\")\n", val.nom, val.nom))
	}
	return strings.Join(str, "")
}

func (wap *webAppMaker) WriteParamsChecker(endpoint Endpoint) string {
	var str []string
	for _, val := range endpoint.model[0].attributs {
		str = append(str, fmt.Sprintf("%s == \"\"", val.nom))
	}
	return strings.Join(str, " || ")
}

func (wap *webAppMaker) WriteControllerForObjectOrArrayReturn(endpoint Endpoint) string {
	var strBuilder strings.Builder

	fmt.Fprintf(&strBuilder, "\nmux.HandleFunc(\"%s %s\",", endpoint.method, wap.HandleURIParamsSyntaxeForGo(endpoint.uri))
	switch endpoint.method {
	case "GET":
		if len(endpoint.model) > 0 {
			if len(endpoint.params) > 0 {
				var attrTab []string
				for _, val := range endpoint.model[0].attributs {
					attrTab = append(attrTab, val.nom)
				}
				fmt.Fprint(&strBuilder, WebAppSelectByParamsTemplate(goapimaker.SelectByWithAttr(endpoint.model[0].nom, strings.Join(attrTab, ", "), endpoint.params[0]), goapimaker.DbCallerPG(), wap.WriteReturnType(endpoint), wap.WriteScanValue(endpoint), strings.ReplaceAll(endpoint.returnPage.nom, " ", ""), endpoint.params[0]))

			} else {
				var attrTab []string
				for _, val := range endpoint.model[0].attributs {
					attrTab = append(attrTab, val.nom)
				}
				fmt.Fprint(&strBuilder, WebAppSelectTemplate(goapimaker.SelectWithAttr(endpoint.model[0].nom, strings.Join(attrTab, ", ")), goapimaker.DbCallerPG(), wap.WriteReturnType(endpoint), wap.WriteScanValue(endpoint), strings.ReplaceAll(endpoint.returnPage.nom, " ", "")))

			}
		} else {
			fmt.Fprint(&strBuilder, WebAppPostViewtemplate(strings.ReplaceAll(endpoint.returnPage.nom, " ", "_")))
		}
	case "POST":
		var attr []string
		for _, val := range endpoint.model[0].attributs {
			attr = append(attr, val.nom)
		}
		fmt.Fprint(&strBuilder, WebAppPostActionTemplate(goapimaker.DbCallerPG(), endpoint.redirectUri, wap.WriteContentExtraction(endpoint), wap.WriteParamsChecker(endpoint), goapimaker.Insert(endpoint.model[0].nom, attr), strings.Join(attr, ", ")))
	case "PUT":
		var attr []string
		for _, val := range endpoint.model[0].attributs {
			attr = append(attr, val.nom)
		}
		fmt.Fprint(&strBuilder, WebAppEditActionTemplate(goapimaker.DbCallerPG(), endpoint.params[0], wap.WriteContentExtraction(endpoint), goapimaker.Update(endpoint.nom, attr, endpoint.params[0]), strings.Join(attr, ", "), endpoint.redirectUri))
	case "DELETE":
		fmt.Fprint(&strBuilder, WebAppDeleteActionTemplate(goapimaker.DbCallerPG(), endpoint.params[0], goapimaker.Delete(endpoint.model[0].nom, endpoint.params[0]), endpoint.redirectUri))
	}
	strBuilder.WriteString(")")
	return strBuilder.String()
}

func (wap *webAppMaker) PageRenderer() string {
	return `
func renderTemplate(w http.ResponseWriter, pageName string, data interface{}) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tpl, err := template.ParseFiles("src/views/" + pageName)
	if err != nil {
		http.Error(w, "Erreur de chargement du template: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if err := tpl.Execute(w, data); err != nil {
		http.Error(w, "Erreur de rendu du template: "+err.Error(), http.StatusInternalServerError)
	}
}	
	`
}

func (mgr *webAppMaker) writeModSumFile() {
	projectName := strings.ReplaceAll(mgr.ProjectName, " ", "_") 
	modfilepath := fmt.Sprintf("%s/%s/web-app/go.mod", config.PROJECT_DIR, projectName)
	sumfilepath := fmt.Sprintf("%s/%s/web-app/go.sum", config.PROJECT_DIR, projectName)
	modfile, _ := os.Create(modfilepath)
	modfile.WriteString(goapimaker.WriteGoMod(strings.ReplaceAll(projectName, " ", "_")))
	sumfile, _ := os.Create(sumfilepath)
	sumfile.WriteString(goapimaker.WriteSum())
}

func (wap *webAppMaker) CreateControllerFile() {
	if wap.Techno == "go" {
		var strBuilder strings.Builder
		filePath := config.PROJECT_DIR+"/"+wap.ProjectName+"/web-app/src/controller/controller.go"
		controllerFile, _ := os.Create(filePath)
		
		strBuilder.WriteString("package controller\n")
		fmt.Fprintf(&strBuilder, "import (\n\"net/http\"\n\"text/template\"\n\"%s/src/config\"\n)", strings.ReplaceAll(wap.ProjectName, " ", "_"))

		strBuilder.WriteString(wap.PageRenderer())

		strBuilder.WriteString("func RegisterRoutes(mux *http.ServeMux){\n")
		for _, val := range wap.Api.endpoints {
			strBuilder.WriteString(wap.WriteControllerForObjectOrArrayReturn(val))
		}
		strBuilder.WriteString("}\n")
		controllerFile.WriteString(strBuilder.String())
	}
}

func (wap *webAppMaker) GenerateView() {}

func (wap *webAppMaker) WebAppGenerator() {
	wap.SetupArch()
	wap.writeModSumFile()
	wap.CreateConfigFile()
	// wap.CreateModelFile()

	wap.CreateControllerFile()
}
