package api

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/MaminirinaEdwino/turbostack/src/config"
	"github.com/MaminirinaEdwino/turbostack/src/entity"
	webview "github.com/webview/webview_go"
)

type ProjectService struct {
	Manager *entity.ProjectManager
}

func (ps *ProjectService) Bind(w webview.WebView) {
	w.Bind("createProject", ps.CreateProject)
	w.Bind("fetchProjects", ps.FetchProjects)
	w.Bind("fetchByProjectName", ps.FetchProjectByName)
	w.Bind("saveProject", ps.SaveProject)
	w.Bind("saveBdd", ps.SaveProjectBDD)
	w.Bind("exportProject", ps.ExportProject)
	w.Bind("fetchProjectFiles", ps.FeychProjectFiles)
}

func (s *ProjectService) ExportProject(name, typeProject string) string {
	var pJson entity.ProjectJSON
	fmt.Println(typeProject)
	config.CheckCreateDir(name)
	pJson = s.FetchProjectByName(name)
	// fmt.Println(pJson)
	switch typeProject {
	case "api":
		config.CheckCreateDir(fmt.Sprintf("%s/api", name))
		s.Manager.ExporterAPI(pJson.ToModel())
	case "models":
		config.CheckCreateDir(fmt.Sprintf("%s/models", name))
		s.Manager.ExporterDB(pJson.ToModel())
	case "frontend":
		config.CheckCreateDir(fmt.Sprintf("%s/frontend", name))
		s.Manager.ExporterStaticSite(pJson.ToModel())
	case "full":
		config.CheckCreateDir(fmt.Sprintf("%s/webapp", name))
		s.Manager.ExporterWebApp(pJson.ToModel())
	}
	return "Success"
}

func (s *ProjectService) CreateProject(name, description, projectType string) string {
	pJson := entity.ProjectJSON{
		Nom:         name,
		Description: description,
		Type:        projectType,
	}
	if s.Manager.CheckIfExist(name) {
		return "Project already exists"
	}
	s.Manager.Create(pJson.ToModel())
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (s *ProjectService) SaveProject(name, project string) string {
	var pJson entity.ProjectJSON
	json.Unmarshal([]byte(project), &pJson)
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (s *ProjectService) SaveProjectBDD(name string, bddJson string) string {
	var bdd entity.BDDJSON
	pJson := s.Manager.LoadProject(name)
	json.Unmarshal([]byte(bddJson), &bdd)
	pJson.BDD = bdd
	pJson.Nom = name
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (mgr *ProjectService) FeychProjectFiles(name string) []entity.FileNode {
	file, _ :=  mgr.Manager.GetProjectFiles(name)
	return file
}

func (s *ProjectService) FetchProjects() []string {
	var projectList []string

	for _, val := range s.Manager.Projects {
		projectList = append(projectList, val.GetNom())
	}
	return projectList
}

func (s *ProjectService) FetchProjectByName(name string) entity.ProjectJSON {
	var pJson entity.ProjectJSON
	filePath := fmt.Sprintf("%s/%s.json", config.PROJECT_DIR,name)
	file, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println(err)
	}
	json.Unmarshal(file, &pJson)
	return pJson
}
