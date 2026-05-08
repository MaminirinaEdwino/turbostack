package entity

import (
	"encoding/json"
	"os"
	"slices"
)

type ProjectManager struct {
	Projects []Project
}

func (mgr *ProjectManager) LoadProjects() error {
	file, err := os.ReadFile("project.json")
	if err != nil {
		return err
	}
	json.Unmarshal(file, &mgr.Projects)
	return nil
}

func (mgr *ProjectManager) SaveProjects() error {
	file, err := os.OpenFile("project.json", os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	jsonValue, err := json.MarshalIndent(mgr.Projects, "", "    ")
	if err != nil {
		return err
	}
	file.Write(jsonValue)
	return nil
}

func (mgr *ProjectManager) GetAll() []Project {
	return mgr.Projects
}

func (mgr *ProjectManager) Create(project Project) {
	mgr.Projects = append(mgr.Projects, project)
}

func (mgr *ProjectManager) Update(project Project) {
	for i, val := range mgr.Projects {
		if val.GetNom() == project.GetNom() {
			mgr.Projects[i] = project
			break
		}
	}
}

func (mgr *ProjectManager) Delete(project Project) {
	for i, val := range mgr.Projects {
		if val.GetNom() == project.GetNom() {
			mgr.Projects = slices.Delete(mgr.Projects, i, i+1)
			break
		}
	}
}

func (mgr *ProjectManager) GetByName(name string) Project {
	for _, val := range mgr.Projects {
		if val.GetNom() == name {
			return val
		}
	}
	return Project{}
}
