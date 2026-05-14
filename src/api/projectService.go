package api

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

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

func (s *ProjectService) SaveProject(pJson entity.ProjectJSON) string {
	s.Manager.SaveProject(pJson)
	return "Success"
}

func (s *ProjectService) SaveProjectBDD(name string, bddJson string) string {
	var bdd entity.BDDJSON
	pJson := s.Manager.LoadProject(name)
	json.Unmarshal([]byte(bddJson), &bdd)
	pJson.BDD = bdd
	pJson.Nom = strings.ReplaceAll(name, " ", "")
	s.Manager.SaveProject(pJson)
	return "Success"
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
	filePath := fmt.Sprintf("turbo_projects/%s.json", strings.ReplaceAll(name, " ", ""))
	file, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println(err)
	}
	json.Unmarshal(file, &pJson)
	return pJson
}
