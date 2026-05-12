package api

import (
	"fmt"

	"github.com/MaminirinaEdwino/turbostack/src/entity"
	webview "github.com/webview/webview_go"
)

type ProjectService struct {
	Manager *entity.ProjectManager
}

func (ps *ProjectService) Bind(w webview.WebView) {
	w.Bind("createProject", ps.CreateProject)
}

func (s *ProjectService) CreateProject(name, description, projectType string) string {
	// Utilisation du modèle JSON pour la transition puis conversion en modèle interne
	pJson := entity.ProjectJSON{
		Nom:         name,
		Description: description,
		Type:        projectType,
	}

	s.Manager.Create(pJson.ToModel())
	s.Manager.SaveProjects()
	fmt.Println(name, description, projectType)
	return "Success"
}
