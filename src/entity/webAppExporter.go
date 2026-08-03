package entity

import (
	"fmt"

	"github.com/MaminirinaEdwino/turbostack/src/config"
)

type webAppMaker struct {
	ProjectName string
	WebApp      WebApp
	Techno      string
}

func (wap *webAppMaker) SetupArch() {
	projectpath := fmt.Sprintf("%s/web-app", wap.ProjectName)
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
		modelMaker.configAPIExporter(wap.ProjectName)
	}
}

func (wap *webAppMaker) GenerateView() {}

func (wap *webAppMaker) WebAppGenerator() {
	wap.SetupArch()
}
