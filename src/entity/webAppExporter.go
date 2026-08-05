package entity

import (
	"fmt"
	"strings"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/utils"
	"golang.org/x/text/unicode/rangetable"
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
			fmt.Fprintf(&strBuilder, "%s %s \"json:`%s`\"", utils.ToUpperFirstLetter(field.nom), field.type_champs, field.nom)
		}
	}
	fmt.Fprint(&strBuilder, "}\n")
	return strBuilder.String()
}



func (wap *webAppMaker) WriteControllerForObjectOrArrayReturn(endpoint Endpoint) string {
	var strBuilder strings.Builder

	fmt.Fprintf(&strBuilder, "mux.HandleFunc(\"%s %s\", func(w http.ResponseWriter, r *http.Request) {\n", endpoint.method, wap.HandleURIParamsSyntaxeForGo(endpoint.uri))
	if endpoint.method != "GET" && endpoint.method != "DELETE" {
		strBuilder.WriteString(wap.WriteBodyType(endpoint))
	}
	fmt.Fprint(&strBuilder, "})\n")
	return strBuilder.String()
}

func (wap *webAppMaker) CreateControllerFile() {
	if wap.Techno == "go" {

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
