package entity

import (
	"fmt"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
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

func (wap *webAppMaker) CreateModelFile() {
	if wap.Techno == "go" {
		modelMaker := GoApiMaker{}
		modelMaker.modelAPIExporter(wap.WebApp.bdd.models, wap.ProjectName)
	}
}

func (wap *webAppMaker) CreateConfigFile() {
	if wap.Techno == "go" {
		modelMaker := GoApiMaker{}
		modelMaker.configAPIExporter(wap.ProjectName)
	}
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

func (wap *webAppMaker) WriteParamsGetter(endpoint Endpoint) string {
	var strBuilder strings.Builder
	for _, val := range endpoint.params {
		fmt.Fprintf(&strBuilder, "%s := r.PathValue(\"%s\")", val, val)
	}
	return strBuilder.String()
}

func (wap *webAppMaker) WriteControllerForObjectOrArrayReturn(endpoint Endpoint) string {
	var strBuilder strings.Builder

	fmt.Fprintf(&strBuilder, "mux.HandleFunc(\"%s %s\", func(w http.ResponseWriter, r *http.Request) {\n", endpoint.method, wap.HandleURIParamsSyntaxeForGo(endpoint.uri))
	fmt.Fprint(&strBuilder, wap.WriteParamsGetter(endpoint))
	if endpoint.method != "GET" && endpoint.method != "DELETE" {
		strBuilder.WriteString(wap.WriteBodyType(endpoint))
		strBuilder.WriteString("var reqBody bodyType\n")
	}

	strBuilder.WriteString("r.ParseForm()")
	for _, val := range endpoint.model {
		for _, mod := range val.attributs {
			fmt.Fprintf(&strBuilder, "reqBody.%s = r.FormValue(\"%s\")\n", utils.ToUpperFirstLetter(mod.nom), mod.nom)
		}
	}

	if endpoint.redirectUri != "" {

	}

	fmt.Fprint(&strBuilder, "})\n")
	return strBuilder.String()
}
func (wap *webAppMaker) PageRenderer()string {
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
func (wap *webAppMaker) CreateControllerFile() {
	if wap.Techno == "go" {
		var strBuilder strings.Builder
		strBuilder.WriteString(wap.PageRenderer())
		for _, val := range wap.Api.endpoints {
			wap.WriteControllerForObjectOrArrayReturn(val)
		}
	}
}

func (wap *webAppMaker) GenerateView() {}

func (wap *webAppMaker) WebAppGenerator() {
	wap.SetupArch()
	wap.CreateConfigFile()
	wap.CreateModelFile()
}
