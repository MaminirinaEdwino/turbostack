package api

import (
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
}

func (s *ProjectService) CreateProject(name, description, projectType string) string {
	// Utilisation du modèle JSON pour la transition puis conversion en modèle interne
	pJson := entity.ProjectJSON{
		Nom:         name,
		Description: description,
		Type:        projectType,
	}
	if s.Manager.CheckIfExist(name) {
		return "Project already exists"
	}
	s.Manager.Create(pJson.ToModel())
	s.Manager.SaveProjects()
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
	for _, val := range s.Manager.Projects {
		if val.GetNom() == name {
			return val.ToJSON()
		}
	}
	return entity.ProjectJSON{}
}
