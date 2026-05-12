package entity

import (
	"encoding/json"
	"os"
	"slices"

	"github.com/MaminirinaEdwino/turbostack/src/service"
)

type ProjectManager struct {
	Projects []Project
}

func (mgr *ProjectManager) LoadProjects() error {

	var pJson []ProjectJSON
	var p Project
	if !service.FileExists("project.json") {
		saveFile, _ := os.Create("project.json")
		jsonData, _ := json.MarshalIndent(pJson, "", "    ")
		saveFile.Write(jsonData)
	}
	file, err := os.ReadFile("project.json")
	if err != nil {
		return err
	}
	json.Unmarshal(file, &pJson)
	for _, val := range pJson {
		p = val.ToModel()
		mgr.Projects = append(mgr.Projects, p)
	}

	return nil
}

func (mgr *ProjectManager) SaveProjects() error {

	file, err := os.OpenFile("project.json", os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0644)
	if err != nil {
		return err
	}

	pJson := make([]ProjectJSON, 0, len(mgr.Projects))
	for i := range mgr.Projects {
		pJson = append(pJson, mgr.Projects[i].ToJSON())
	}

	jsonValue, err := json.MarshalIndent(pJson, "", "    ")
	if err != nil {
		return err
	}
	file.Write(jsonValue)
	return nil
}

func (mgr *ProjectManager) CheckIfExist(name string) bool {
	for _, project := range mgr.Projects {
		if project.GetNom() == name {
			return true
		}
	}
	return false
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
