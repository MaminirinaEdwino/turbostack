package entity

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"
)

type ProjectManager struct {
	Projects []Project
}

func (mgr *ProjectManager) LoadProjects() error {

	// var pJson []ProjectJSON
	// var p Project
	// if !service.FileExists("project.json") {
	// 	saveFile, _ := os.Create("project.json")
	// 	jsonData, _ := json.MarshalIndent(pJson, "", "    ")
	// 	saveFile.Write(jsonData)
	// }
	// file, err := os.ReadFile("project.json")
	// if err != nil {
	// 	return err
	// }
	// json.Unmarshal(file, &pJson)
	// for _, val := range pJson {
	// 	p = val.ToModel()
	// 	mgr.Projects = append(mgr.Projects, p)
	// }

	projectFiles, err := os.ReadDir("turbo_projects")
	if err != nil {
		return err
	}
	for _, val := range projectFiles {
		var pJson ProjectJSON
		var p Project
		filePath := fmt.Sprintf("turbo_projects/%s", val.Name()) 
		saveFile, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}

		json.Unmarshal(saveFile, &pJson)
		p.SetNom(pJson.Nom)
		p.SetType(pJson.Type)
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

func (mgr *ProjectManager) SaveProject(project ProjectJSON) error {
	filepath := fmt.Sprintf("turbo_projects/%s.json", strings.ReplaceAll(project.Nom, " ", "", ))
	file, err := os.OpenFile(filepath, os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	jsonData, err := json.MarshalIndent(project, "", "    ")
	if err != nil {
		return nil
	}
	file.Write(jsonData)
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
	var tmp Project
	tmp.SetNom(project.GetNom())
	tmp.SetType(project.GetType())
	mgr.Projects = append(mgr.Projects, tmp)
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
